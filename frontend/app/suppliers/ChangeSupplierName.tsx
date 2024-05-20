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

export default function ChangeSupplierNameDialogForm({
	supplierId,
	currentName,
	onSubmit,
}: {
	supplierId: string;
	currentName: string;
	onSubmit?: () => void;
}) {
	const [newSupplierName, setNewSupplierName] =
		React.useState<string>(currentName);

	async function handleNewSupplierNameSubmit() {
		if (newSupplierName === "") {
			toast.error("Please enter a name for the new supplier.");
			return;
		}
		if (newSupplierName === currentName) {
			toast.error("Supplier is already named that.");
			return;
		}

		fetch(`/inventory_api/suppliers/${supplierId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				new_name: newSupplierName,
			}),
		}).then((response) => {
			if (!response.ok) {
				toast.error("Failed to change supplier name.");
				return;
			} else {
				toast.success("Successfully changed supplier name.");
				if (onSubmit) onSubmit();
			}
		});
	}

	return (
		<div className="flex flex-col gap-4">
			<Label htmlFor="newSupplierName">New Supplier Name</Label>
			<Input
				id="newSupplierName"
				value={newSupplierName}
				onChange={(event) => setNewSupplierName(event.target.value)}
			/>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant={"outline"} className="" type="reset">
						Cancel
					</Button>
				</DialogClose>
				<Button
					variant={"default"}
					type="submit"
					onClick={() => handleNewSupplierNameSubmit()}
				>
					Change Name
				</Button>
			</DialogFooter>
		</div>
	);
}