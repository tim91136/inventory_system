from flask import Blueprint, abort, g, request
from flask_login import login_required
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from database import db
import backend.models as mo
import backend.schemas as schemas
from backend.lib.utils.database.supplier import get_suppliers, get_supplier_by_id
from config import get_config
from marshmallow import Schema, fields, validate, ValidationError
from backend.lib.utils.decorators import admin_required

limiter = Limiter(
    get_remote_address,
    app=None,
    default_limits=["5000 per hour", "100 per minute"]
)

config = get_config()

suppliers_blueprint = Blueprint("suppliers_blueprint", __name__, url_prefix="/suppliers")

@suppliers_blueprint.get("")
@limiter.limit("200 per minute")
@login_required
def get_all_suppliers():
    """
    Return all suppliers from the database
    """

    suppliers = get_suppliers(db.session)
    if suppliers is None:
        abort(404, "No supplier found")
    print("Lets see the suppliers:")
    print(suppliers)

    return schemas.SuppliersSchema().dump(obj=suppliers, many=True)


@suppliers_blueprint.put("")
@limiter.limit("100 per minute")
@login_required
@admin_required
def create_new_supplier():
    """
    Expects json
    {
        "name": "<new supplier name>"
    }
    """
    if not request.is_json:
        abort(400, "Missin JSON in request body.")
    if request.json["name"] is None:
        abort(400, "key 'name' (str) missing in body")

    new_name = request.json["name"]

    new_supplier = mo.Supplier(
        name=new_name
    )
    db.session.add(new_supplier)
    db.session.commit()
    db.session.refresh(new_supplier)

    return {
        "message": "created new supplier",
        "supplier": {
            "id": new_supplier.id
        }
    }, 201

@suppliers_blueprint.delete("/<supplier_id>")
@limiter.limit("100 per minute")
@login_required
@admin_required
def delete_supplier(supplier_id: str):

    supplier = get_supplier_by_id(db.session, supplier_id)

    db.session.delete(supplier)
    db.session.commit()
    return {
        "message": "successfully deleted supplier",
        "supplier": {
            "id": supplier.id
        }
    }, 204


@suppliers_blueprint.patch("/<supplier_id>")
@limiter.limit("100 per minute")
@login_required
@admin_required
def change_supplier(supplier_id: str):
    """
    Expects json
    {
        "name": "" # max len 100
    }
    edit a suppliers attributes mainly the name

    """
    supplier = get_supplier_by_id(db.session, supplier_id)

    if supplier is None:
        abort(404, "Supplier not found")
    if not request.is_json:
        abort(400, "request body is not json")

    class EditSupplierJsonSchema(Schema):
        new_name = fields.String(required=True,
                                 validate=validate.Length(max=100, min=1)
                                 )

    try:
        data = EditSupplierJsonSchema().load(request.json)
    except ValidationError as e:
        abort(400, f"json body structure is wrong {e.messages}")

    old_name = supplier.name
    new_name = data["new_name"]
    supplier.name = new_name
    db.session.commit()
    db.session.refresh(supplier)

    return {
        "message": "changed name of supplier",
        "supplier": {
            "id": supplier.id,
            "old_name": old_name,
            "new_name": supplier.name
        }
    }
