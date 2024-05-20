import React from 'react';
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
import { PlusIcon } from "lucide-react";

import { Supplier, Product } from "@/lib/types/inventory";
import useProducts from "@/lib/hooks/useProduct";

export default function NewOrderForm({
    onSubmit
} : {
    onSubmit: () => void;
}) {
  const { products } = useProducts();
  const [selectedProducts, setSelectedProducts] = React.useState<{product_id: number; quantity: number}[]>([]);

  const handleQuantityChange = (productId: number, quantity: number) => {
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

  async function handleNewOrderSubmit() {
    
    const response = await fetch('/inventory_api/orders', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: selectedProducts.map(p => ({ product_id: p.product_id, quantity: Number(p.quantity) })),
      }),
    });

    if (!response.ok) {
      toast.error("Failed to create new order.");
      return;
    }
    toast.success("Successfully created new order.");
    onSubmit();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">
          <PlusIcon size={16} />
          Add New Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Order</DialogTitle>
          <DialogDescription>Select products and specify quantities.</DialogDescription>
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
            onClick={handleNewOrderSubmit}
          >
            Create Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
