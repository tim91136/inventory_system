import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditIcon } from "lucide-react";

import { Product } from "@/lib/types/inventory";
import useProducts from "@/lib/hooks/useProduct";

export default function ChangeOrderDialogForm({
  orderId,
  onSubmit
}: {
  orderId: string;
  onSubmit?: () => void;
}) {
  const { products } = useProducts();
  const [orderProducts, setOrderProducts] = useState<{ product_id: string; quantity: number }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ product_id: string; quantity: number }[]>([]);

  useEffect(() => {
    // Fetch the existing order data
    async function fetchOrder() {
      const response = await fetch(`/inventory_api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        const formattedProducts = data.order_products.map((orderProduct: any) => ({
          product_id: orderProduct.product_id,
          quantity: orderProduct.quantity
        }));
        setOrderProducts(formattedProducts);
        setSelectedProducts(formattedProducts);
      } else {
        toast.error("Failed to fetch order data.");
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newSelectedProducts = selectedProducts.map(product =>
      product.product_id === productId ? { ...product, quantity } : product
    );
    setSelectedProducts(newSelectedProducts);
  };

  const toggleProductSelection = (product: Product) => {
    if (selectedProducts.some(p => p.product_id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.product_id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, { product_id: product.id, quantity: 0 }]);
    }
  };

  async function handleChangeOrderSubmit() {
    const response = await fetch(`/inventory_api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: selectedProducts.map(p => ({ product_id: p.product_id, quantity: Number(p.quantity) })),
      }),
    });

    if (!response.ok) {
      toast.error("Failed to update the order.");
      return;
    }
    toast.success("Successfully updated the order.");
    if (onSubmit) onSubmit();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">
          <EditIcon size={16} />
          Edit Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>Modify products and quantities in the order.</DialogDescription>
        </DialogHeader>
        {products && products.map(product => (
          <div key={product.id} className="product-item">
            <Input
              id={`product-${product.id}`}
              type="checkbox"
              checked={selectedProducts.some(p => p.product_id === product.id)}
              onChange={() => toggleProductSelection(product)}
              className="checkbox-input"
            />
            <Label htmlFor={`product-${product.id}`} className="product-label">{product.name}</Label>
            {selectedProducts.some(p => p.product_id === product.id) && (
              <Input
                type="number"
                min="0"
                max={product.quantity}
                value={selectedProducts.find(p => p.product_id === product.id)?.quantity || 0}
                onChange={(event) => handleQuantityChange(product.id, parseInt(event.target.value))}
                className="quantity-input"
                style={{ backgroundColor: '#333', color: '#fff' }} // Styles for dark mode
              />
            )}
          </div>
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} className="border-red-500">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleChangeOrderSubmit}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
