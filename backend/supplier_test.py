import pytest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app import create_app, db
from backend.models import User, Supplier
from backend.schemas import SuppliersSchema

@pytest.fixture(scope='module')
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SECRET_KEY'] = 'testsecretkey'

    with app.app_context():
        db.create_all()

        # Create an admin user for the tests
        admin_user = User(email='admin@test.com', username='admin', is_admin=True)
        admin_user.set_password('adminpassword')
        db.session.add(admin_user)
        db.session.commit()

    yield app

    with app.app_context():
        db.drop_all()


@pytest.fixture(scope='function')
def client(app):
    with app.app_context():
        db.session.begin_nested()  # Use nested transactions to rollback after each test
        yield app.test_client()
        db.session.rollback()  # Rollback to clean up the changes made during the test


def login(client, email, password):
    return client.post('/auth/login', json=dict(
        email=email,
        password=password
    ), follow_redirects=True)


def test_get_all_suppliers(client):
    with client.application.app_context():
        supplier1 = Supplier(name="Supplier 1")
        supplier2 = Supplier(name="Supplier 2")
        db.session.add(supplier1)
        db.session.add(supplier2)
        db.session.commit()

    response = client.get("/suppliers")
    assert response.status_code == 200

    suppliers = SuppliersSchema(many=True).load(response.json)
    assert len(suppliers) == 2


def test_create_new_supplier(client):
    login(client, 'admin@test.com', 'adminpassword')

    response = client.put("/suppliers", json={"name": "New Supplier"})
    assert response.status_code == 201

    data = response.get_json()
    assert data["message"] == "created new supplier"
    assert "supplier" in data
    assert "id" in data["supplier"]


def test_delete_supplier(client):
    with client.application.app_context():
        supplier = Supplier(name="Supplier to Delete")
        db.session.add(supplier)
        db.session.commit()

    login(client, 'admin@test.com', 'adminpassword')

    response = client.delete(f"/suppliers/{supplier.id}")
    assert response.status_code == 204

    with client.application.app_context():
        deleted_supplier = db.session.query(Supplier).get(supplier.id)
        assert deleted_supplier is None


def test_change_supplier(client):
    with client.application.app_context():
        supplier = Supplier(name="Supplier to Change")
        db.session.add(supplier)
        db.session.commit()

    login(client, 'admin@test.com', 'adminpassword')

    response = client.patch(f"/suppliers/{supplier.id}", json={"new_name": "Updated Supplier"})
    assert response.status_code == 200

    data = response.get_json()
    assert data["message"] == "changed name of supplier"
    assert data["supplier"]["old_name"] == "Supplier to Change"
    assert data["supplier"]["new_name"] == "Updated Supplier"


if __name__ == '__main__':
    pytest.main()
