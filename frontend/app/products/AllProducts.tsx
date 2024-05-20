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

import ChangeProductDialogForm from "./ChangeProduct";
import NewProductForm from "./NewProduct";
import useSuppliers from "@/lib/hooks/useSupplier";
import useProducts from "@/lib/hooks/useProduct";
import useUser from "@/lib/auth/useUser";

export default function AllProducts() {

	const { products, isLoading, refreshProducts } = useProducts();
	const { suppliers } = useSuppliers();
	const { user } = useUser();
	const [searchQuery, setSearchQuery] = useState("");

	async function handleProductDelete(productId: string) {
		const response = await fetch(
			`/inventory_api/products/${productId}`,
			{
				method: "DELETE",
			}
		);
		if (!response.ok) {
			toast.error("Failed to delete product. ${response.status} Please try again.");
			return;
		}
		toast.success("Successfully deleted product.");
		refreshProducts();
	}

	const filteredProducts = products && products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="rounded-md border-muted shadow-md border p-4">
			<div className="flex justify-between flex-wrap gap-2">
				<div>
					<h2 className="text-xl font-semibold">Products</h2>
					<p className="text-muted-foreground">
						A product is a good or service from a supplier that can be ordered and sold.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<input
							type="text"
							placeholder="Search products"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border border-gray-500 bg-black p-2 rounded"
						/>
					{user?.is_admin && (<NewProductForm
						suppliers={suppliers}
						onSubmit={() => {
							refreshProducts();
						}}
					/>)}
				</div>
			</div>
			<br />
			<ul>{isLoading && <li>Loading Products...</li>}</ul>
			<Table>
				<TableCaption>
					Current in stock products.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Name</TableHead>
						{user?.is_admin && (<TableHead>Edit</TableHead>)}
						<TableHead>Quantity</TableHead>
						<TableHead>Availability</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Supplier</TableHead>
						{user?.is_admin && (<TableHead className="text-right">Delete</TableHead>)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredProducts &&
						filteredProducts.map((product) => (
							<TableRow
								key={product.id}
								className="font-medium"
							>
								<TableCell className="font-medium">
									{product.name}
								</TableCell>

								{user?.is_admin && (
								<TableCell className="text-right">
									<Dialog>
										<DialogTrigger asChild>
											<Button className="flex gap-1 items-center">
												Edit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Change Product
												</DialogTitle>
												<DialogDescription></DialogDescription>
											</DialogHeader>
											<ChangeProductDialogForm
												productId={product.id}
												currentName={product.name}
												currentQuantity={product.quantity}
												suppliers={suppliers}
												onSubmit={() => {
													refreshProducts();
												}}
											/>
										</DialogContent>
									</Dialog>
								</TableCell>)}

								<TableCell className="font-medium">
									{product.quantity}
								</TableCell>

								<TableCell className="font-medium">
									{product.quantity > 0 ? (
										product.quantity < 10 ? 
										<span style={{ color: 'orange' }}>Low</span> : 
										<span style={{ color: 'green' }}>In Stock</span>
									) : <span style={{ color: 'red' }}>Out of Stock</span>}
								</TableCell>

								<TableCell>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												{" "}
												<SensorCreatedDelta
													created={product.created}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													{new Date(
														product.created
													).toLocaleString()}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>

								<TableCell className="font-medium">
								<ul>
									{product.supplier ? (
									<li key={product.supplier.id}>{product.supplier.name}</li>
									) : (
									<li>No Supplier</li>
									)}
								</ul>
								</TableCell>

								{user?.is_admin && (
								<TableCell className="text-right">
									{
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant={"ghost"}>
													<Trash2Icon className="w-6 h-6" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle>
														Are you sure you want to
														delete this product?
													</AlertDialogTitle>
													<AlertDialogDescription>
														This action cannot be
														undone. This will
														permanently delete the
														product.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction asChild>
														<Button
															variant="outline"
															className="bg-destructive text-destructive-foreground hover:opacity-70"
															onClick={() => {
																handleProductDelete(
																	product.id
																);
															}}
														>
															Delete Permanently
														</Button>
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									}
								</TableCell>)}
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
