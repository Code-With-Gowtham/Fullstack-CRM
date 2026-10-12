from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentTenantUser, Database
from app.api.routes.auth import user_read
from app.api.deps import TenantUser
from app.models import Membership, User
from app.schemas import MembershipUpdate, UserRead

router = APIRouter(prefix="/users", tags=["users"])


def require_admin(role: str) -> None:
    if role != "admin":
        raise HTTPException(status_code=403, detail="Only workspace administrators can manage users.")


@router.get("", response_model=list[UserRead])
def list_users(current: CurrentTenantUser, db: Database) -> list[UserRead]:
    require_admin(current.membership.role)
    rows = db.execute(
        select(User, Membership)
        .join(Membership, Membership.user_id == User.id)
        .where(Membership.organization_id == current.organization.id)
        .order_by(Membership.created_at.asc(), User.name.asc())
    ).all()
    return [
        user_read(TenantUser(user=user, membership=membership, organization=current.organization))
        for user, membership in rows
    ]


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: str, current: CurrentTenantUser, db: Database) -> UserRead:
    require_admin(current.membership.role)
    row = db.execute(
        select(User, Membership)
        .join(Membership, Membership.user_id == User.id)
        .where(
            Membership.organization_id == current.organization.id,
            Membership.user_id == user_id,
        )
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="User not found in this workspace.")
    user, membership = row
    return user_read(TenantUser(user=user, membership=membership, organization=current.organization))


@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: str, payload: MembershipUpdate, current: CurrentTenantUser, db: Database) -> UserRead:
    require_admin(current.membership.role)
    membership = db.scalar(
        select(Membership).where(
            Membership.organization_id == current.organization.id,
            Membership.user_id == user_id,
        )
    )
    if membership is None:
        raise HTTPException(status_code=404, detail="User not found in this workspace.")

    changes = payload.model_dump(exclude_unset=True, by_alias=False)
    if "role" in changes and changes["role"] is not None:
        membership.role = changes["role"]
    if "active" in changes and changes["active"] is not None:
        membership.active = changes["active"]

    db.commit()
    db.refresh(membership)
    return user_read(TenantUser(user=db.get(User, membership.user_id), membership=membership, organization=current.organization))
