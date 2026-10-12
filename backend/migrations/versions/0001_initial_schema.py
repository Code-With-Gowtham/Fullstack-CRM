"""Create the initial multi-tenant CRM schema.

Revision ID: 0001_initial
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table(
        "memberships",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("organization_id", sa.String(36), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(24), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("organization_id", "user_id", name="uq_membership_org_user"),
    )
    op.create_index("ix_memberships_user_org", "memberships", ["user_id", "organization_id"])
    op.create_table(
        "customers",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("organization_id", sa.String(36), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("phone", sa.String(40), nullable=False),
        sa.Column("company", sa.String(160), nullable=False),
        sa.Column("industry", sa.String(100), nullable=False),
        sa.Column("location", sa.String(120), nullable=False),
        sa.Column("type", sa.String(24), nullable=False),
        sa.Column("value", sa.String(16), nullable=False),
        sa.Column("segment", sa.String(24), nullable=False),
        sa.Column("churn_probability", sa.Integer(), nullable=False),
        sa.Column("churn_risk", sa.String(16), nullable=False),
        sa.Column("sentiment", sa.String(16), nullable=False),
        sa.Column("sentiment_score", sa.Float(), nullable=False),
        sa.Column("assigned_to", sa.String(120), nullable=False),
        sa.Column("total_revenue", sa.Integer(), nullable=False),
        sa.Column("purchase_count", sa.Integer(), nullable=False),
        sa.Column("last_purchase_at", sa.String(32), nullable=False),
        sa.Column("last_interaction_at", sa.String(32), nullable=False),
        sa.Column("next_follow_up_at", sa.String(32), nullable=False),
        sa.Column("created_at", sa.String(32), nullable=False),
        sa.Column("whatsapp", sa.String(40), nullable=False),
        sa.UniqueConstraint("organization_id", "email", name="uq_customer_org_email"),
    )
    op.create_index("ix_customers_organization_id", "customers", ["organization_id"])
    op.create_index("ix_customers_org_created", "customers", ["organization_id", "created_at"])
    op.create_table(
        "leads",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("organization_id", sa.String(36), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(254), nullable=False),
        sa.Column("phone", sa.String(40), nullable=False),
        sa.Column("company", sa.String(160), nullable=False),
        sa.Column("location", sa.String(120), nullable=False),
        sa.Column("industry", sa.String(100), nullable=False),
        sa.Column("source", sa.String(80), nullable=False),
        sa.Column("assigned_to", sa.String(120), nullable=False),
        sa.Column("status", sa.String(24), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("temperature", sa.String(16), nullable=False),
        sa.Column("created_at", sa.String(32), nullable=False),
        sa.Column("last_contacted_at", sa.String(32), nullable=False),
        sa.Column("expected_revenue", sa.Integer(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False),
        sa.UniqueConstraint("organization_id", "email", name="uq_lead_org_email"),
    )
    op.create_index("ix_leads_organization_id", "leads", ["organization_id"])
    op.create_index("ix_leads_org_created", "leads", ["organization_id", "created_at"])


def downgrade() -> None:
    op.drop_table("leads")
    op.drop_table("customers")
    op.drop_index("ix_memberships_user_org", table_name="memberships")
    op.drop_table("memberships")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_table("organizations")
