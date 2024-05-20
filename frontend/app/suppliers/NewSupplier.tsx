import React from 'react';
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import useSuppliers from "@/lib/hooks/useSupplier";

export default function NewSupplierForm({
    onSubmit
} : { 
    onSubmit: () => void;
}) {
  const [newSupplierName, setNewSupplierName] = React.useState<string>("");
  const [nameExists, setNameExists] = React.useState<boolean>(false);
  const { suppliers } = useSuppliers();

  async function handleNewSupplierSubmit() {
    if (newSupplierName.trim() === "") {
      toast.error("Please enter a name for the new supplier.");
      return;
    }

  	// Check if the supplier name already exists
    if (suppliers) {
		setNameExists(suppliers.some(supplier => supplier.name.toLowerCase() === newSupplierName.toLowerCase()));
	}

    if (nameExists) {
      toast.error("A supplier with this name already exists. Please use a different name.");
      return;
    }

    const response = await fetch('/inventory_api/suppliers', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newSupplierName }),
    });

    if (!response.ok) {
      toast.error("Failed to create new supplier.");
      return;
    }

    toast.success("Successfully created new supplier.");
    setNewSupplierName("");
    onSubmit();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-1 items-center">
          <PlusIcon size={16} />
          Add New Supplier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Supplier</DialogTitle>
          <DialogDescription>Create a new supplier.</DialogDescription>
        </DialogHeader>
        <Label htmlFor="newSupplierName">Supplier Name</Label>
        <Input
          id="newSupplierName"
          value={newSupplierName}
          onChange={(event) => setNewSupplierName(event.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} className="border-red-500">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleNewSupplierSubmit}
          >
            Create Supplier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
