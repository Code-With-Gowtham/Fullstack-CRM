from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.api.deps import CurrentTenantUser, Database, TenantUser
from app.core.security import create_access_token, hash_password, verify_password
from app.models import Membership, Organization, User
from app.schemas import AuthResponse, LoginRequest, RegisterRequest, UserRead

router = APIRouter(prefix="/auth", tags=["authentication"])

ROLE_PRESENTATION = {
    "admin": ("Operations", "bg-rose-500"),
    "manager": ("Sales", "bg-amber-500"),
    "sales": ("Sales", "bg-emerald-500"),
    "support": ("Support", "bg-teal-500"),
}


def user_read(tenant_user: TenantUser) -> UserRead:
    user = tenant_user.user
    department, avatar_color = ROLE_PRESENTATION[tenant_user.membership.role]
    return UserRead(
        id=user.id,
        name=user.name,
        email=user.email,
        role=tenant_user.membership.role,
        department=department,
        status="active" if user.active and tenant_user.membership.active else "inactive",
        avatarColor=avatar_color,
        initials="".join(part[0].upper() for part in user.name.split()[:2]),
        joinedAt=user.created_at.date().isoformat(),
        organizationId=tenant_user.organization.id,
        organizationName=tenant_user.organization.name,
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Database) -> AuthResponse:
    email = str(payload.email).lower()
    if db.scalar(select(User.id).where(User.email == email)) is not None:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    organization = Organization(name=payload.organization_name)
    user = User(name=payload.name, email=email, password_hash=hash_password(payload.password))
    try:
        db.add_all([organization, user])
        db.flush()
        membership = Membership(organization_id=organization.id, user_id=user.id, role="admin")
        db.add(membership)
        db.commit()
        db.refresh(user)
        db.refresh(organization)
        db.refresh(membership)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Unable to create this account.") from None

    tenant_user = TenantUser(user=user, membership=membership, organization=organization)
    return AuthResponse(
        accessToken=create_access_token(user.id, organization.id),
        user=user_read(tenant_user),
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Database) -> AuthResponse:
    email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == email, User.active.is_(True)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    membership = db.scalar(
        select(Membership)
        .where(Membership.user_id == user.id, Membership.active.is_(True))
        .order_by(Membership.created_at)
    )
    if membership is None:
        raise HTTPException(status_code=403, detail="This account has no active organization membership.")
    organization = db.get(Organization, membership.organization_id)
    if organization is None:
        raise HTTPException(status_code=403, detail="This account's organization is unavailable.")

    tenant_user = TenantUser(user=user, membership=membership, organization=organization)
    return AuthResponse(
        accessToken=create_access_token(user.id, organization.id),
        user=user_read(tenant_user),
    )


@router.get("/me", response_model=UserRead)
def me(current: CurrentTenantUser) -> UserRead:
    return user_read(current)
