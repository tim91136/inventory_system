import backend.models as mo
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields

class SuppliersSchema(SQLAlchemySchema):
    class Meta:
        model = mo.Supplier
        include_fk = True

    id = auto_field()
    name = auto_field()
    created = auto_field()
    updated = auto_field()
    products = fields.Nested('ProductsSchema', many=True, exclude=('supplier',))

class ProductsSchema(SQLAlchemySchema):
    class Meta:
        model = mo.Product
        include_fk = True

    id = auto_field()
    name = auto_field()
    quantity = auto_field()  # Stock quantity
    supplier = fields.Nested('SuppliersSchema', exclude=('products',))
    created = auto_field()
    updated = auto_field()
    orders = fields.Nested('OrderProductSchema', many=True, exclude=('product',))

class OrdersSchema(SQLAlchemySchema):
    class Meta:
        model = mo.Order
        include_fk = True

    id = auto_field()
    order_products = fields.Nested('OrderProductSchema', many=True)
    is_active = auto_field()
    is_canceled = auto_field()
    is_done = auto_field()
    is_archived = auto_field()
    created = auto_field()
    updated = auto_field()

class OrderProductSchema(SQLAlchemySchema):
    class Meta:
        model = mo.OrderProduct
        include_fk = True

    order_id = auto_field()
    product_id = auto_field()
    quantity = auto_field()

    product = fields.Nested('ProductsSchema', exclude=('orders',))
    order = fields.Nested('OrdersSchema', exclude=('order_products',))


    