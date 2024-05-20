from flask import Blueprint, abort, request
from flask_login import login_required
from database import db
import backend.models as mo
import backend.schemas as schemas
from backend.lib.utils.database.product import get_products, get_product_by_id
from config import get_config
from marshmallow import Schema, fields, validate, ValidationError
from backend.lib.utils.decorators import admin_required

config = get_config()

products_blueprint = Blueprint("products_blueprint", __name__, url_prefix="/products")

@products_blueprint.get("")
@login_required
def get_all_products():
    """
    Return all products from the database
    """

    products = get_products(db.session)
    if products is None:
        abort(404, "No product found")
    print("Lets see the products:")
    print(products)

    return schemas.ProductsSchema().dump(obj=products, many=True)


@products_blueprint.put("")
@login_required
@admin_required
def create_new_product():
    """
    Expects json
    {
        "name": "<new product name>"
        "quantity": "<quantity>"
        "supplier_id": "<supplier_id>"
    }
    """
    if not request.is_json:
        abort(400, "Missin JSON in request body.")
    if request.json["name"] is None:
        abort(400, "key 'name' (str) missing in body")
    if request.json["quantity"] is None:
        abort(400, "key 'quantity' (int) missing in body")
    if request.json["supplier_id"] is None:
        abort(400, "key 'supplier_id' (str) missing in body")

    new_name = request.json["name"]
    new_quantity = request.json["quantity"]
    supplier_id = request.json["supplier_id"]

    # Checking if the supplier exists
    if not db.session.query(mo.Supplier).filter_by(id=supplier_id).first():
        abort(404, description=f"Supplier with id {supplier_id} not found.")

    new_product = mo.Product(
        name=new_name,
        quantity=new_quantity,
        supplier_id=supplier_id
    )

    db.session.add(new_product)
    db.session.commit()
    db.session.refresh(new_product)

    return {
        "message": "created new product",
        "product": {
            "id": new_product.id
        }
    }, 201

@products_blueprint.delete("/<product_id>")
@login_required
@admin_required
def delete_product(product_id: str):

    product = get_product_by_id(db.session, product_id)

    db.session.delete(product)
    db.session.commit()
    return {
        "message": "successfully deleted product",
        "product": {
            "id": product.id
        }
    }, 204


@products_blueprint.patch("/<product_id>")
@login_required
@admin_required
def change_product(product_id: str):
    """
    Expects json
    {
        "name": "" # max len 100
        "quantity": "" # int
    }
    edit a products attributes mainly the name and quantity

    """
    product = get_product_by_id(db.session, product_id)

    if product is None:
        abort(404, "Product not found")
    if not request.is_json:
        abort(400, "request body is not json")

    class EditProductJsonSchema(Schema):
        new_name = fields.String(required=True,
                                 validate=validate.Length(max=100, min=1)
                                 )
        new_quantity = fields.Integer(required=True)
        new_supplier_id = fields.String(required=True)

    try:
        data = EditProductJsonSchema().load(request.json)
    except ValidationError as e:
        abort(400, f"json body structure is wrong {e.messages}")

    old_name = product.name
    new_name = data["new_name"]
    new_quantity = data["new_quantity"]
    new_supplier_id = data["new_supplier_id"]
    product.name = new_name
    product.quantity = new_quantity
    product.supplier_id = new_supplier_id
    db.session.commit()
    db.session.refresh(product)

    return {
        "message": "changed product",
        "product": {
            "id": product.id,
            "old_name": old_name,
            "new_name": product.name,
            "new_quantity": new_quantity
        }
    }
