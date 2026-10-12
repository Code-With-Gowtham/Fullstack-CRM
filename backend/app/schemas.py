from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.models import utc_now

Role = Literal["admin", "manager", "sales", "support"]
LeadStatus = Literal["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Converted", "Lost"]


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(word.capitalize() for word in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        from_attributes=True,
        populate_by_name=True,
        str_strip_whitespace=True,
    )


class RegisterRequest(APIModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    organization_name: str = Field(min_length=2, max_length=160)


class LoginRequest(APIModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserRead(APIModel):
    id: str
    name: str
    email: EmailStr
    role: Role
    department: str
    status: Literal["active", "inactive"]
    avatar_color: str
    initials: str
    joined_at: str
    organization_id: str
    organization_name: str


class MembershipUpdate(APIModel):
    role: Role | None = None
    active: bool | None = None


class AuthResponse(APIModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserRead


class CustomerFields(APIModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    company: str = Field(min_length=1, max_length=160)
    industry: str = Field(default="", max_length=100)
    location: str = Field(default="", max_length=120)
    type: Literal["Enterprise", "SMB", "Startup"] = "SMB"
    value: Literal["High", "Medium", "Low"] = "Medium"
    segment: Literal["Champion", "Loyal", "At Risk", "Hibernating", "New"] = "New"
    churn_probability: int = Field(default=0, ge=0, le=100)
    churn_risk: Literal["Low", "Medium", "High"] = "Low"
    sentiment: Literal["Positive", "Neutral", "Negative"] = "Neutral"
    sentiment_score: float = Field(default=0.5, ge=0, le=1)
    assigned_to: str = Field(default="", max_length=120)
    total_revenue: int = Field(default=0, ge=0)
    purchase_count: int = Field(default=0, ge=0)
    last_purchase_at: str = Field(default="", max_length=32)
    last_interaction_at: str = Field(default="", max_length=32)
    next_follow_up_at: str = Field(default="", max_length=32)
    created_at: str = Field(default_factory=lambda: utc_now().date().isoformat(), max_length=32)
    whatsapp: str = Field(default="", max_length=40)


class CustomerCreate(CustomerFields):
    pass


class CustomerUpdate(APIModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    company: str | None = Field(default=None, min_length=1, max_length=160)
    industry: str | None = Field(default=None, max_length=100)
    location: str | None = Field(default=None, max_length=120)
    type: Literal["Enterprise", "SMB", "Startup"] | None = None
    value: Literal["High", "Medium", "Low"] | None = None
    segment: Literal["Champion", "Loyal", "At Risk", "Hibernating", "New"] | None = None
    churn_probability: int | None = Field(default=None, ge=0, le=100)
    churn_risk: Literal["Low", "Medium", "High"] | None = None
    sentiment: Literal["Positive", "Neutral", "Negative"] | None = None
    sentiment_score: float | None = Field(default=None, ge=0, le=1)
    assigned_to: str | None = Field(default=None, max_length=120)
    total_revenue: int | None = Field(default=None, ge=0)
    purchase_count: int | None = Field(default=None, ge=0)
    last_purchase_at: str | None = Field(default=None, max_length=32)
    last_interaction_at: str | None = Field(default=None, max_length=32)
    next_follow_up_at: str | None = Field(default=None, max_length=32)
    created_at: str | None = Field(default=None, max_length=32)
    whatsapp: str | None = Field(default=None, max_length=40)


class CustomerRead(CustomerFields):
    id: str


class LeadFields(APIModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=40)
    company: str = Field(min_length=1, max_length=160)
    location: str = Field(default="", max_length=120)
    industry: str = Field(default="", max_length=100)
    source: str = Field(default="Website", max_length=80)
    assigned_to: str = Field(default="", max_length=120)
    status: LeadStatus = "New"
    score: int = Field(default=50, ge=0, le=100)
    temperature: Literal["Hot", "Warm", "Cold"] = "Warm"
    created_at: str = Field(default_factory=lambda: utc_now().date().isoformat(), max_length=32)
    last_contacted_at: str = Field(default="", max_length=32)
    expected_revenue: int = Field(default=0, ge=0)
    notes: str = Field(default="", max_length=5000)

    @model_validator(mode="after")
    def set_temperature_from_score(self):
        self.temperature = "Hot" if self.score >= 80 else "Warm" if self.score >= 50 else "Cold"
        return self


class LeadCreate(LeadFields):
    pass


class LeadUpdate(APIModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    company: str | None = Field(default=None, min_length=1, max_length=160)
    location: str | None = Field(default=None, max_length=120)
    industry: str | None = Field(default=None, max_length=100)
    source: str | None = Field(default=None, max_length=80)
    assigned_to: str | None = Field(default=None, max_length=120)
    status: LeadStatus | None = None
    score: int | None = Field(default=None, ge=0, le=100)
    temperature: Literal["Hot", "Warm", "Cold"] | None = None
    created_at: str | None = Field(default=None, max_length=32)
    last_contacted_at: str | None = Field(default=None, max_length=32)
    expected_revenue: int | None = Field(default=None, ge=0)
    notes: str | None = Field(default=None, max_length=5000)


class LeadRead(LeadFields):
    id: str

