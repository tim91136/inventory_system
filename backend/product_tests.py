import pytest
from flask import url_for
from flask_testing import TestCase
from app import create_app
from database import db
from backend.models import Product, Supplier
from backend.lib.utils.database.product import get_products, get_product_by_id

class TestViews(TestCase):
    def create_app(self):
        app = create_app()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        return app

    def setUp(self):
        db.create_all()
        self.supplier = Supplier(id="test_supplier")
        self.product = Product(name="test_product", quantity=10, supplier_id="test_supplier")
        db.session.add(self.supplier)
        db.session.add(self.product)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_get_all_products(self):
        response = self.client.get(url_for('products_blueprint.get_all_products'))
        self.assert200(response)
        self.assertEqual(len(response.json), 1)

    def test_create_new_product(self):
        response = self.client.put(url_for('products_blueprint.create_new_product'), json={
            "name": "new_product",
            "quantity": 20,
            "supplier_id": "test_supplier"
        })
        self.assert201(response)
        self.assertEqual(response.json['product']['id'], 2)

    def test_delete_product(self):
        response = self.client.delete(url_for('products_blueprint.delete_product', product_id=1))
        self.assert200(response)
        self.assertEqual(response.json['product']['id'], 1)

    def test_change_product(self):
        response = self.client.patch(url_for('products_blueprint.change_product', product_id=1), json={
            "new_name": "changed_product",
            "new_quantity": 30,
            "new_supplier_id": "test_supplier"
        })
        self.assert200(response)
        self.assertEqual(response.json['product']['new_name'], "changed_product")
        self.assertEqual(response.json['product']['new_quantity'], 30)

if __name__ == '__main__':
    pytest.main()