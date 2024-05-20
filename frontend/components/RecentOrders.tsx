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

import useOrders from "@/lib/hooks/useOrder";

export default function RecentOrders() {

	const { orders, isError, isLoading, refreshOrders } = useOrders();

	const getStatus = (order) => {
		let color;
		let text;
		if (order.is_archived) {
		  color = "violet";
		  text = "Archived";
		} else if (order.is_done) {
		  color = "green";
		  text = "Done";
		} else if (order.is_active) {
		  color = '#9EB1FF';
		  text = "Active";
		} else if (order.is_canceled) {
		  color = "orange";
		  text = "Canceled";
		} else {
		  color = "grey";
		  text = "Undefined";
		}
		return <span style={{ color }}>{text}</span>;
	  };

    
    const recentOrders = orders?.filter(order => {
		const now = new Date();
		const createdDate = new Date(order.created);
		const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
		return hoursDiff < 24;
	}).sort((a, b) => new Date(b.created) - new Date(a.created)) || [];
	  

	return (
		<div className="rounded-md border-muted shadow-md border p-4">
			<div className="flex justify-between flex-wrap gap-2">
				<div className="flex items-center gap-1">
                    <svg
								fill="none"
								viewBox="-6 -3 24 24"
								strokeWidth={0.1}
								stroke="currentColor"
								className="w-10 h-10 text-yellow-600"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
									fill="currentColor" 
									fill-rule="evenodd" 
									clip-rule="evenodd">
								</path>
					</svg>
					<h2 className="text-xl font-semibold">Activity: Recent Orders in last 24h</h2>
				</div>
			</div>
			<br />
			<ul>{isLoading && <li>Loading Orders...</li>}</ul>
			<Table>
				<TableCaption>
					Most recent orders of all statuses.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Product</TableHead>
						<TableHead>Quantity</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{recentOrders &&
						recentOrders.map((order) => (
							<TableRow
								key={order.id}
								className="font-medium"
							>
								<TableCell>
									{order.order_products.map((orderProduct, index) => (
									<React.Fragment key={orderProduct.product.id}>
										{orderProduct.product.name}{index < order.order_products.length - 1 && <br />}
									</React.Fragment>
									))}
								</TableCell>
								
								<TableCell>
									{order.order_products.map((orderProduct, index) => (
										<React.Fragment key={orderProduct.product.id}>
											{orderProduct.quantity}{index < order.order_products.length - 1 && <br />}
										</React.Fragment>
									))}
								</TableCell>

								<TableCell>{getStatus(order)}</TableCell>

								<TableCell>
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												{" "}
												<SensorCreatedDelta
													created={order.created}
												/>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													{new Date(
														order.created
													).toLocaleString()}
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
		</div>
	);
}
