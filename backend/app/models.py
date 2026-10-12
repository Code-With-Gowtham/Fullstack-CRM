from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


def new_id() -> str:
    return str(uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class Membership(Base):
    __tablename__ = "memberships"
    __table_args__ = (
        UniqueConstraint("organization_id", "user_id", name="uq_membership_org_user"),
        Index("ix_memberships_user_org", "user_id", "organization_id"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(24), nullable=False, default="admin")
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_customer_org_email"),
        Index("ix_customers_org_created", "organization_id", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    company: Mapped[str] = mapped_column(String(160), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    location: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    type: Mapped[str] = mapped_column(String(24), nullable=False, default="SMB")
    value: Mapped[str] = mapped_column(String(16), nullable=False, default="Medium")
    segment: Mapped[str] = mapped_column(String(24), nullable=False, default="New")
    churn_probability: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    churn_risk: Mapped[str] = mapped_column(String(16), nullable=False, default="Low")
    sentiment: Mapped[str] = mapped_column(String(16), nullable=False, default="Neutral")
    sentiment_score: Mapped[float] = mapped_column(nullable=False, default=0.5)
    assigned_to: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    total_revenue: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    purchase_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_purchase_at: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    last_interaction_at: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    next_follow_up_at: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    created_at: Mapped[str] = mapped_column(String(32), nullable=False, default=lambda: utc_now().date().isoformat())
    whatsapp: Mapped[str] = mapped_column(String(40), nullable=False, default="")


class Lead(Base):
    __tablename__ = "leads"
    __table_args__ = (
        UniqueConstraint("organization_id", "email", name="uq_lead_org_email"),
        Index("ix_leads_org_created", "organization_id", "created_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    organization_id: Mapped[str] = mapped_column(
        ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(254), nullable=False)
    phone: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    company: Mapped[str] = mapped_column(String(160), nullable=False)
    location: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    industry: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    source: Mapped[str] = mapped_column(String(80), nullable=False, default="Website")
    assigned_to: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    status: Mapped[str] = mapped_column(String(24), nullable=False, default="New")
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=50)
    temperature: Mapped[str] = mapped_column(String(16), nullable=False, default="Warm")
    created_at: Mapped[str] = mapped_column(String(32), nullable=False, default=lambda: utc_now().date().isoformat())
    last_contacted_at: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    expected_revenue: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
