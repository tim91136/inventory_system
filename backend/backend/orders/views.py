from flask import Blueprint, abort, request
from flask_login import login_required
from database import db
import backend.models as mo
import backend.schemas as schemas
from backend.lib.utils.database.order import get_orders, get_order_by_id
from config import get_config
from marshmallow import Schema, fields, validate, ValidationError

class ProductInfoSchema(Schema):
    product_id = fields.String(required=True)
    quantity = fields.Integer(required=True, validate=validate.Range(min=1))

class EditOrderJsonSchema(Schema):
    products = fields.List(fields.Nested(ProductInfoSchema), required=True)

class StatusUpdateSchema(Schema):
    status = fields.String(required=True, validate=lambda x: x in ['active', 'done', 'canceled', 'archived'])


config = get_config()

orders_blueprint = Blueprint("orders_blueprint", __name__, url_prefix="/orders")

@orders_blueprint.get("")
@login_required
def get_all_orders():
    """
    Return all orders from the database
    """
    orders = get_orders(db.session)
    print ("ORDERS:::")
    print (orders)
    if orders is None:
        abort(404, "No order found")

    return schemas.OrdersSchema().dump(obj=orders, many=True)


@orders_blueprint.put("")
@login_required
def create_new_order():
    """
    Create a new order with the products given in the json body
    """

    if not request.is_json:
        abort(400, "Missing JSON in request body.")

    json_data = request.get_json()
    product_data = json_data.get("products")

    if not product_data:
        abort(400, "Key 'products' missing in body")

    print(json_data)
    # Initialize a new order
    new_order = mo.Order(is_active=True)
    db.session.add(new_order)

    for product_info in product_data:
        product_id = product_info.get("product_id")
        quantity = product_info.get("quantity")

        # Fetch the product to check existence and sufficient quantity
        product = db.session.query(mo.Product).filter_by(id=product_id).first()
        if not product or product.quantity < quantity:
            db.session.rollback()
            abort(404, description=f"Product with id {product_id} not found or insufficient quantity.")

        # Decrement the stock
        product.quantity -= quantity

        # Create an OrderProduct association object
        order_product = mo.OrderProduct(order=new_order, product=product, quantity=quantity)
        db.session.add(order_product)

    db.session.commit()

    return {
        "message": "New order created successfully",
        "order_id": new_order.id
    }, 201

@orders_blueprint.get("/<order_id>")
@login_required
def get_order(order_id: str):
    """
    Return one order from the database
    """
    order = get_order_by_id(db.session, order_id)
    if order is None:
        abort(404, "No order found")

    return schemas.OrdersSchema().dump(obj=order, many=False)

@orders_blueprint.delete("/<order_id>")
@login_required
def delete_order(order_id: str):
    """
    Delete an order and increment the stock of each product in the order.
    """
    order = get_order_by_id(db.session, order_id)
    
    if not order:
        abort(404, description="Order not found.")

    # Increment the stock of each product in the order
    for order_product in order.order_products:
        product = order_product.product
        product.quantity += order_product.quantity
        db.session.add(product)

    # Delete the associated order products
    for order_product in order.order_products:
        db.session.delete(order_product)

    # Delete the order
    db.session.delete(order)
    
    db.session.commit()
    
    return {
        "message": "Successfully deleted order",
        "order": {
            "id": order.id
        }
    }, 204


@orders_blueprint.patch("/<order_id>")
@login_required
def change_order(order_id: str):
    """
    Expects json

    Edit an order's attributes mainly the products, quantities, status
    """
    order = get_order_by_id(db.session, order_id)

    if order is None:
        abort(404, "Order not found")
    if not request.is_json:
        abort(400, "Request body is not JSON")

    try:
        data = EditOrderJsonSchema().load(request.json)
    except ValidationError as e:
        abort(400, f"JSON body structure is wrong: {e.messages}")

    new_products = data["products"]
    product_map = {product_info["product_id"]: product_info["quantity"] for product_info in new_products}

    # Adjust stock for the existing products in the order
    for order_product in order.order_products:
        product = order_product.product
        new_quantity = product_map.get(order_product.product_id, 0)
        
        # Calculate the difference in quantity
        quantity_diff = new_quantity - order_product.quantity
        
        # Adjust the product's stock based on the quantity difference
        product.quantity -= quantity_diff
        
        if new_quantity == 0:
            db.session.delete(order_product)  # Remove the product if new quantity is zero
        else:
            order_product.quantity = new_quantity  # Update to the new quantity
            db.session.add(order_product)
        
        db.session.add(product)

    # Add new products to the order
    for product_info in new_products:
        if not any(op.product_id == product_info["product_id"] for op in order.order_products):
            product_id = product_info["product_id"]
            quantity = product_info["quantity"]

            product = db.session.query(mo.Product).filter_by(id=product_id).first()
            if not product or product.quantity < quantity:
                db.session.rollback()
                abort(404, description=f"Product with id {product_id} not found or insufficient quantity.")

            product.quantity -= quantity
            order_product = mo.OrderProduct(order_id=order.id, product_id=product.id, quantity=quantity)
            db.session.add(order_product)

    db.session.commit()
    db.session.refresh(order)

    return {
        "message": "Order updated successfully",
        "order": {
            "id": order.id,
            "products": new_products
        }
    }

@orders_blueprint.patch("/<order_id>/status")
@login_required
def update_order_status(order_id: str):
    """
    Update the status of an order.
    """
    order = get_order_by_id(db.session, order_id)
    
    if order is None:
        abort(404, "Order not found")
    if not request.is_json:
        abort(400, "Request body is not JSON")
    
    try:
        data = StatusUpdateSchema().load(request.json)
    except ValidationError as e:
        abort(400, f"JSON body structure is wrong: {e.messages}")

    status = data["status"]
    
    order.is_active = status == "active"
    order.is_done = status == "done"
    order.is_canceled = status == "canceled"
    order.is_archived = status == "archived"

    db.session.commit()
    db.session.refresh(order)

    return {
        "message": "Order status updated successfully",
        "order": {
            "id": order.id,
            "status": status
        }
    }