def register(client, email: str, organization_name: str) -> dict:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Gowtham Raj",
            "email": email,
            "password": "safe-password-123",
            "organizationName": organization_name,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_frontend_origin_can_call_api(client):
    response = client.options(
        "/api/v1/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "GET" in response.headers["access-control-allow-methods"]


def test_registration_login_and_tenant_isolation(client):
    health = client.get("/api/v1/health")
    assert health.status_code == 200
    assert health.json() == {"status": "ok", "database": "ok"}

    first_account = register(client, "admin@first.example", "First Workspace")
    second_account = register(client, "admin@second.example", "Second Workspace")

    first_token = first_account["accessToken"]
    second_token = second_account["accessToken"]
    first_headers = auth_header(first_token)
    second_headers = auth_header(second_token)

    me = client.get("/api/v1/auth/me", headers=first_headers)
    assert me.status_code == 200
    assert me.json()["organizationName"] == "First Workspace"
    assert me.json()["role"] == "admin"

    create_response = client.post(
        "/api/v1/customers",
        headers=first_headers,
        json={
            "name": "Ram Kumar",
            "email": "ram@customer.example",
            "company": "First Workspace Customer",
        },
    )
    assert create_response.status_code == 201, create_response.text
    customer_id = create_response.json()["id"]
    assert create_response.json()["name"] == "Ram Kumar"

    first_list = client.get("/api/v1/customers", headers=first_headers)
    second_list = client.get("/api/v1/customers", headers=second_headers)
    assert len(first_list.json()) == 1
    assert second_list.json() == []

    cross_tenant_read = client.get(f"/api/v1/customers/{customer_id}", headers=second_headers)
    assert cross_tenant_read.status_code == 404

    update_response = client.patch(
        f"/api/v1/customers/{customer_id}",
        headers=first_headers,
        json={"location": "Chennai"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["location"] == "Chennai"
    assert client.delete(f"/api/v1/customers/{customer_id}", headers=first_headers).status_code == 204
    assert client.get(f"/api/v1/customers/{customer_id}", headers=first_headers).status_code == 404

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@first.example", "password": "safe-password-123"},
    )
    assert login.status_code == 200
    assert login.json()["user"]["id"] == first_account["user"]["id"]


def test_authentication_and_input_validation(client):
    account = register(client, "owner@example.com", "Owner Workspace")
    token = account["accessToken"]

    no_token = client.get("/api/v1/customers")
    assert no_token.status_code == 401

    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@example.com", "password": "wrong-password"},
    )
    assert bad_login.status_code == 401

    duplicate_registration = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Another Owner",
            "email": "owner@example.com",
            "password": "safe-password-123",
            "organizationName": "Duplicate Workspace",
        },
    )
    assert duplicate_registration.status_code == 409

    invalid_customer = client.post(
        "/api/v1/customers",
        headers=auth_header(token),
        json={"name": "", "email": "not-an-email", "company": ""},
    )
    assert invalid_customer.status_code == 422


def test_lead_crud_and_role_gate(client, db_session):
    from sqlalchemy import select

    from app.models import Membership, User

    account = register(client, "seller@example.com", "Seller Workspace")
    headers = auth_header(account["accessToken"])
    created = client.post(
        "/api/v1/leads",
        headers=headers,
        json={
            "name": "Raja Muthu",
            "email": "raja@lead.example",
            "company": "Example Ltd",
            "score": 85,
        },
    )
    assert created.status_code == 201, created.text
    lead = created.json()
    assert lead["temperature"] == "Hot"

    updated = client.patch(
        f"/api/v1/leads/{lead['id']}",
        headers=headers,
        json={"score": 30},
    )
    assert updated.status_code == 200
    assert updated.json()["temperature"] == "Cold"

    deleted = client.delete(f"/api/v1/leads/{lead['id']}", headers=headers)
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/leads/{lead['id']}", headers=headers).status_code == 404

    user = db_session.scalar(select(User).where(User.email == "seller@example.com"))
    membership = db_session.scalar(select(Membership).where(Membership.user_id == user.id))
    membership.role = "support"
    db_session.commit()
    assert client.get("/api/v1/leads", headers=headers).status_code == 403
    assert client.get("/api/v1/customers", headers=headers).status_code == 200


def test_admin_can_list_and_update_members(client, db_session):
    from sqlalchemy import select

    from app.core.security import hash_password
    from app.models import Membership, Organization, User

    account = register(client, "ops@example.com", "Ops Workspace")
    headers = auth_header(account["accessToken"])
    organization = db_session.scalar(select(Organization).where(Organization.name == "Ops Workspace"))

    member = User(
        name="Priya Nair",
        email="priya@ops.example",
        password_hash=hash_password("safe-password-123"),
    )
    db_session.add(member)
    db_session.flush()
    membership = Membership(organization_id=organization.id, user_id=member.id, role="sales", active=True)
    db_session.add(membership)
    db_session.commit()

    response = client.get("/api/v1/users", headers=headers)
    assert response.status_code == 200, response.text
    users = response.json()
    assert any(item["email"] == "priya@ops.example" for item in users)
    assert any(item["email"] == "ops@example.com" for item in users)

    detail = client.get(f"/api/v1/users/{member.id}", headers=headers)
    assert detail.status_code == 200, detail.text
    assert detail.json()["email"] == "priya@ops.example"

    updated = client.patch(
        f"/api/v1/users/{member.id}",
        headers=headers,
        json={"role": "manager", "active": False},
    )
    assert updated.status_code == 200, updated.text
    payload = updated.json()
    assert payload["role"] == "manager"
    assert payload["status"] == "inactive"
