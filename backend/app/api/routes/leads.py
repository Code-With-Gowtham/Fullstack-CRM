from fastapi import APIRouter, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentTenantUser, Database
from app.models import Lead
from app.schemas import LeadCreate, LeadRead, LeadUpdate

router = APIRouter(prefix="/leads", tags=["leads"])

SALES_ROLES = {"admin", "manager", "sales"}


def require_sales_role(role: str) -> None:
    if role not in SALES_ROLES:
        raise HTTPException(status_code=403, detail="Your role cannot access lead records.")


def get_lead(db: Database, organization_id: str, lead_id: str) -> Lead:
    lead = db.scalar(
        select(Lead).where(Lead.id == lead_id, Lead.organization_id == organization_id)
    )
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found.")
    return lead


@router.get("", response_model=list[LeadRead])
def list_leads(current: CurrentTenantUser, db: Database) -> list[Lead]:
    require_sales_role(current.membership.role)
    return list(
        db.scalars(
            select(Lead)
            .where(Lead.organization_id == current.organization.id)
            .order_by(Lead.created_at.desc(), Lead.name)
        )
    )


@router.post("", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(payload: LeadCreate, current: CurrentTenantUser, db: Database) -> Lead:
    require_sales_role(current.membership.role)
    values = payload.model_dump(by_alias=False)
    values["email"] = str(payload.email).lower()
    lead = Lead(
        organization_id=current.organization.id,
        **values,
    )
    db.add(lead)
    try:
        db.commit()
        db.refresh(lead)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A lead with this email already exists in this workspace.") from None
    return lead


@router.get("/{lead_id}", response_model=LeadRead)
def read_lead(lead_id: str, current: CurrentTenantUser, db: Database) -> Lead:
    require_sales_role(current.membership.role)
    return get_lead(db, current.organization.id, lead_id)


@router.patch("/{lead_id}", response_model=LeadRead)
def update_lead(
    lead_id: str,
    payload: LeadUpdate,
    current: CurrentTenantUser,
    db: Database,
) -> Lead:
    require_sales_role(current.membership.role)
    lead = get_lead(db, current.organization.id, lead_id)
    changes = payload.model_dump(exclude_unset=True, by_alias=False)
    if "email" in changes and changes["email"] is not None:
        changes["email"] = str(changes["email"]).lower()
    if "score" in changes and changes["score"] is not None:
        score = changes["score"]
        changes["temperature"] = "Hot" if score >= 80 else "Warm" if score >= 50 else "Cold"
    for key, value in changes.items():
        setattr(lead, key, value)
    try:
        db.commit()
        db.refresh(lead)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="A lead with this email already exists in this workspace.") from None
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: str, current: CurrentTenantUser, db: Database) -> Response:
    require_sales_role(current.membership.role)
    lead = get_lead(db, current.organization.id, lead_id)
    db.delete(lead)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
