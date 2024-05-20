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
import { Select } from "@/components/ui/select";
import { PlusIcon } from "lucide-react";

import { Supplier } from "@/lib/types/inventory";
import useProducts from "@/lib/hooks/useProduct";

export default function NewProductForm({
    suppliers,
    onSubmit
} : { 
    suppliers: Supplier[] | undefined;
    onSubmit: () => void;
}) {
  const [newProductName, setNewProductName] = React.useState("");
  const [nameExists, setNameExists] = React.useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState('');
  const [quantity, setQuantity] = React.useState(0);
  const { products } = useProducts();

  async function handleNewProductSubmit() {
    if (newProductName === "") {
      toast.error("Please enter a name for the new product.");
      return;
    }
	// Check if the product name already exists
	if (products) {
    setNameExists(products?.some(product => product.name.toLowerCase() === newProductName.toLowerCase()));
    }

    if (nameExists) {
      toast.error("A product with this name already exists. Please use a different name.");
      return;
    }

    const response = await fetch('/inventory_api/products', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newProductName,
        supplier_id: selectedSupplierId,
        quantity: Number(quantity),
      }),
    });

    if (!response.ok) {
      toast.error("Failed to create new product.");
      return;
    }
    toast.success("Successfully created new product.");
    setNewProductName("");
    onSubmit();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">
          <PlusIcon size={16} />
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>Create a new product.</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="newProductName">Product Name</Label>
          <Input
            id="newProductName"
            value={newProductName}
            onChange={(event) => setNewProductName(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quantityInput">Quantity</Label>
          <Input
            id="quantityInput"
            type="number"
            min="0"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            style={{ backgroundColor: '#333', color: '#fff' }} // Styles for dark mode
          />
        </div>
        <div>
          <Label htmlFor="supplierSelect">Supplier</Label>
            <select className="rounded-md border-muted shadow-md border p-1"
							id="supplierSelect"
							value={selectedSupplierId}
							onChange={(event) => setSelectedSupplierId(event.target.value)}
							style={{ backgroundColor: '#333' }}
						>
							<option value="">Select a Supplier</option>
							{suppliers && suppliers.map(supplier => (
								<option key={supplier.id} value={supplier.id}>{supplier.name}</option>
							))}
						</select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} className="border-red-500">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleNewProductSubmit}
          >
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
