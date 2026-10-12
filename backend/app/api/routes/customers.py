from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentTenantUser, Database
from app.models import Customer
from app.schemas import CustomerCreate, CustomerRead, CustomerUpdate

router = APIRouter(prefix="/customers", tags=["customers"])


def get_customer(db: Database, organization_id: str, customer_id: str) -> Customer:
    customer = db.scalar(
        select(Customer).where(
            Customer.id == customer_id,
            Customer.organization_id == organization_id,
        )
    )
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return customer


@router.get("", response_model=list[CustomerRead])
def list_customers(current: CurrentTenantUser, db: Database) -> list[Customer]:
    return list(
        db.scalars(
            select(Customer)
            .where(Customer.organization_id == current.organization.id)
            .order_by(Customer.created_at.desc(), Customer.name)
        )
    )


@router.post("", response_model=CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate, current: CurrentTenantUser, db: Database) -> Customer:
    values = payload.model_dump(by_alias=False)
    values["email"] = str(payload.email).lower()
    customer = Customer(
        organization_id=current.organization.id,
        **values,
    )
    db.add(customer)
    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A customer with this email already exists in this workspace.") from None
    return customer


@router.get("/{customer_id}", response_model=CustomerRead)
def read_customer(customer_id: str, current: CurrentTenantUser, db: Database) -> Customer:
    return get_customer(db, current.organization.id, customer_id)


@router.patch("/{customer_id}", response_model=CustomerRead)
def update_customer(
    customer_id: str,
    payload: CustomerUpdate,
    current: CurrentTenantUser,
    db: Database,
) -> Customer:
    customer = get_customer(db, current.organization.id, customer_id)
    changes = payload.model_dump(exclude_unset=True, by_alias=False)
    if "email" in changes and changes["email"] is not None:
        changes["email"] = str(changes["email"]).lower()
    for key, value in changes.items():
        setattr(customer, key, value)
    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A customer with this email already exists in this workspace.") from None
    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: str, current: CurrentTenantUser, db: Database) -> Response:
    customer = get_customer(db, current.organization.id, customer_id)
    db.delete(customer)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
