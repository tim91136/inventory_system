"use client";

import React from "react";
import { toast } from "sonner";

import {
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Supplier } from "@/lib/types/inventory";

export default function ChangeProductDialogForm({
	productId,
	currentName,
	currentQuantity,
	suppliers,
	onSubmit,
}: {
	productId: string;
	currentName: string;
	currentQuantity: number;
	suppliers: Supplier[] | undefined;
	onSubmit?: () => void;
}) {
	const [newProductName, setNewProductName] =
		React.useState<string>(currentName);

	const [newProductSupplier, setNewProductSupplier] =
		React.useState<string>("");

	const [newProductQuantity, setNewProductQuantity] =
		React.useState<number>(currentQuantity);

	async function handleNewProductSubmit() {
		if (newProductName === "") {
			toast.error("Please enter a name for the new product.");
			return;
		}

		fetch(`/inventory_api/products/${productId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_name: newProductName,
				new_quantity: newProductQuantity,
				new_supplier_id: newProductSupplier,
			}),
		}).then((response) => {
			if (!response.ok) {
				toast.error("Failed to change product.");
				return;
			} else {
				toast.success("Successfully changed product.");
				if (onSubmit) onSubmit();
			}
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<Label htmlFor="newProductName">New Product Name</Label>
			<Input
				id="newProductName"
				value={newProductName}
				onChange={(event) => setNewProductName(event.target.value)}
			/>
			<div>
					<Label htmlFor="quantityInput">Set Quantity</Label>
					<Input
						id="quantityInput"
						type="number"
						min="0"
						value={newProductQuantity}
						onChange={(event) => setNewProductQuantity(event.target.value)}
						style={{ backgroundColor: '#333', color: '#fff' }} // Styles for dark mode
					/>
			</div>
			<div>
					<Label htmlFor="newsupplierSelect">Supplier</Label>
						<select className="rounded-md border-muted shadow-md border p-1"
							id="newsupplierSelect"
							value={newProductSupplier}
							onChange={(event) => setNewProductSupplier(event.target.value)}
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
					<Button variant={"outline"} className="" type="reset">
						Cancel
					</Button>
				</DialogClose>
				<Button
					variant={"default"}
					type="submit"
					onClick={() => handleNewProductSubmit()}
				>
					Apply Changes
				</Button>
			</DialogFooter>
		</div>
	);
}