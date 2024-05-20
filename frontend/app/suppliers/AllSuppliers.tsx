"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import SensorCreatedDelta from "@/components/sensor/SensorCreatedDelta";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import ChangeSupplierNameDialogForm from "./ChangeSupplierName";
import NewSupplierForm from "./NewSupplier";
import useUser from "@/lib/auth/useUser";
import useSuppliers from "@/lib/hooks/useSupplier";

export default function AllSuppliers() {
	const { suppliers, isLoading, refreshSuppliers } = useSuppliers();
	const { user } = useUser();
	const [searchQuery, setSearchQuery] = useState("");

	async function handleSupplierDelete(supplierId: string) {
		const response = await fetch(`/inventory_api/suppliers/${supplierId}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			toast.error(`Failed to delete supplier. ${response.status} Please try again.`);
			return;
		}
		toast.success("Successfully deleted supplier.");
		refreshSuppliers();
	}

	const filteredSuppliers = suppliers && suppliers.filter((supplier) =>
		supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="rounded-md border-muted shadow-md border p-4">
			<div className="flex justify-between items-center flex-wrap gap-2">
				<div>
					<h2 className="text-xl font-semibold">Suppliers</h2>
					<p className="text-muted-foreground">
						A supplier is a company or person that provides products.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<input
						type="text"
						placeholder="Search suppliers"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border border-gray-500 bg-black p-2 rounded"
					/>
					{user?.is_admin && (
						<NewSupplierForm
							onSubmit={() => {
								refreshSuppliers();
							}}
						/>
					)}
				</div>
			</div>
			<br />
			<ul>{isLoading && <li>Loading Suppliers...</li>}</ul>
			<Table>
				<TableCaption>Currently registered suppliers.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Name</TableHead>
						{user?.is_admin && <TableHead>Edit</TableHead>}
						<TableHead>Created</TableHead>
						<TableHead>Products</TableHead>
						{user?.is_admin && <TableHead className="text-right">Delete</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredSuppliers &&
						filteredSuppliers.map((supplier) => (
							<TableRow key={supplier.id} className="font-medium">
								<TableCell className="font-medium">{supplier.name}</TableCell>
								{user?.is_admin && (
									<TableCell className="text-right">
										<Dialog>
											<DialogTrigger asChild>
												<Button className="flex gap-1 items-center">Edit</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Change Supplier Name</DialogTitle>
													<DialogDescription></DialogDescription>
												</DialogHeader>
												<ChangeSupplierNameDialogForm
													supplierId={supplier.id}
													currentName={supplier.name}
													onSubmit={() => {
														refreshSuppliers();
													}}
												/>
											</DialogContent>
										</Dialog>
									</TableCell>
								)}
								<TableCell>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<SensorCreatedDelta created={supplier.created} />
											</TooltipTrigger>
											<TooltipContent>
												<p>{new Date(supplier.created).toLocaleString()}</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
								<TableCell className="font-medium">
									<ul>
										{supplier.products.map((product) => (
											<li key={product.id}>
												{product.name} - Quantity: {product.quantity}
											</li>
										))}
									</ul>
								</TableCell>
								{user?.is_admin && (
									<TableCell className="text-right">
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant={"ghost"}>
													<Trash2Icon className="w-6 h-6" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you sure you want to delete this supplier?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be undone. This will permanently delete the supplier.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction asChild>
														<Button
															variant="outline"
															className="bg-destructive text-destructive-foreground hover:opacity-70"
															onClick={() => {
																handleSupplierDelete(supplier.id);
															}}
														>
															Delete Permanently
														</Button>
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</TableCell>
								)}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
