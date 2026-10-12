from dataclasses import dataclass
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db import get_db
from app.models import Membership, Organization, User

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class TenantUser:
    user: User
    membership: Membership
    organization: Organization


def get_current_tenant_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> TenantUser:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized
    try:
        claims = decode_access_token(credentials.credentials)
        user_id = claims.get("sub")
        organization_id = claims.get("org")
        if not isinstance(user_id, str) or not isinstance(organization_id, str):
            raise unauthorized
    except (jwt.InvalidTokenError, TypeError):
        raise unauthorized from None

    row = db.execute(
        select(User, Membership, Organization)
        .join(Membership, Membership.user_id == User.id)
        .join(Organization, Organization.id == Membership.organization_id)
        .where(
            User.id == user_id,
            User.active.is_(True),
            Membership.organization_id == organization_id,
            Membership.active.is_(True),
        )
    ).first()
    if row is None:
        raise unauthorized
    return TenantUser(user=row[0], membership=row[1], organization=row[2])


CurrentTenantUser = Annotated[TenantUser, Depends(get_current_tenant_user)]
Database = Annotated[Session, Depends(get_db)]
