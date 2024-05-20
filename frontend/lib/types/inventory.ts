export type Order = {
    id: string;
    order_products: OrderProduct[];
    is_active: boolean;
    is_canceled: boolean;
    is_done: boolean;
    is_archived: boolean;
    created: string;
    updated: string;
}

export type Product = {
    id: number;
    name: string;
    quantity: number;
    created: string;
    supplier: Supplier[];
}

export type Supplier = {
    id: number;
    name: string;
    created: string;
    products: Product[];
}

export type OrderProduct = {
    product: Product;
    quantity: number;
};
