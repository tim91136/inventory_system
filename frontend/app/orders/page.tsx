import React from "react";
import AllOrders from "./AllOrders";

export default function page() {
	return (
		<main className="">
			<section className="lg:px-std-wide px-std-sm mb-8">
				<h1 className="mb-2" style={{ fontWeight: '500' }}><span style={{ color: '#9EB1FF' }}>inventory</span> Orders</h1>
				<p className="text-opacity-75 border-l-4 border-blue-500 px-2 py-1 bg-opacity-25 bg-blue-800 w-fit rounded">
					Overview of all orders
				</p>
			</section>
			<section className="lg:px-std-wide px-std-sm">
				<AllOrders />
			</section>
		</main>
	);
}
