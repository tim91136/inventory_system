"use client";

import React from "react";

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

import useProducts from "@/lib/hooks/useProduct";

export default function LowStockProducts() {

	const { products, isLoading, refreshProducts } = useProducts();

    const filteredProducts = products
    ? products
            .filter(product => product.quantity <= 10) // Filter low in stock and out of stock products
            .sort((a, b) => a.quantity - b.quantity) // Sort by quantity (out of stock first)
    : [];

	return (
		<div className="rounded-md border-muted shadow-md border p-4">
			<div className="flex justify-between flex-wrap gap-2">
				<div className="flex items-center gap-1">
                    <svg 
								fill="none"
								viewBox="-5 -4 24 24"
								strokeWidth={0.1}
								stroke="currentColor"
								className="w-10 h-10 text-yellow-600"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path 
									d="M5 1C5 0.447715 5.44772 0 6 0H9C9.55228 0 10 0.447715 10 1V2H14C14.5523 2 15 2.44772 15 3V6C15 6.8888 14.6131 7.68734 14 8.23608V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V8.2359C0.38697 7.68721 0 6.88883 0 6V3C0 2.44772 0.447716 2 1 2H5V1ZM9 1V2H6V1H9ZM1 3H5H5.5H9.5H10H14V6C14 6.654 13.6866 7.23467 13.1997 7.6004C12.8655 7.85144 12.4508 8 12 8H8V7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V8H3C2.5493 8 2.1346 7.85133 1.80029 7.60022C1.31335 7.23446 1 6.65396 1 6V3ZM7 9H3C2.64961 9 2.31292 8.93972 2 8.82905V11.5C2 11.7761 2.22386 12 2.5 12H12.5C12.7761 12 13 11.7761 13 11.5V8.82915C12.6871 8.93978 12.3504 9 12 9H8V9.5C8 9.77614 7.77614 10 7.5 10C7.22386 10 7 9.77614 7 9.5V9Z"
									fill="currentColor" 
									fill-rule="evenodd" 
									clip-rule="evenodd">
								</path>
					</svg>
					<h2 className="text-xl font-semibold">Low in stock / Out of stock Products</h2>
				</div>

			</div>
			<br />
			<ul>{isLoading && <li>Loading Products...</li>}</ul>
			<Table>
				<TableCaption>
					Current low in stock / out of stock products.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Name</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Availability</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Supplier</TableHead>
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
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
