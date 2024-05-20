import Link from "next/link";
import React from "react";
import RecentOrders from "@/components/RecentOrders";
import LowStockProducts from "@/components/LowStockProducts";
import Statistics from "@/components/Statistics";

export default function Home() {
	return (
		<main className="overflow-hidden">
			<section className="flex gap-4 flex-col items-center justify-center">
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<h1 style={{ fontWeight: '300' }}>
						<span style={{ color: '#9EB1FF' }}>inventory_</span>
					</h1>
					<h1 style={{ fontWeight: '500' }}>System</h1>
				</div>
				<span className="text-xl text-foreground">
					Manage your products, suppliers and orders
				</span>
			</section>
			<section className="lg:px-std-wide px-std-sm relative">
				<ul className="flex gap-4 justify-center py-12 flex-wrap items-center">
					<Card
						title="Product Management"
						description="Add, update, delete and list products"
						href="/products"
						icon={
							<svg 
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={0.5}
								stroke="currentColor"
								className="w-12 h-12 text-blue-400"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path 
									d="M5 1C5 0.447715 5.44772 0 6 0H9C9.55228 0 10 0.447715 10 1V2H14C14.5523 2 15 2.44772 15 3V6C15 6.8888 14.6131 7.68734 14 8.23608V11.5C14 12.3284 13.3284 13 12.5 13H2.5C1.67157 13 1 12.3284 1 11.5V8.2359C0.38697 7.68721 0 6.88883 0 6V3C0 2.44772 0.447716 2 1 2H5V1ZM9 1V2H6V1H9ZM1 3H5H5.5H9.5H10H14V6C14 6.654 13.6866 7.23467 13.1997 7.6004C12.8655 7.85144 12.4508 8 12 8H8V7.5C8 7.22386 7.77614 7 7.5 7C7.22386 7 7 7.22386 7 7.5V8H3C2.5493 8 2.1346 7.85133 1.80029 7.60022C1.31335 7.23446 1 6.65396 1 6V3ZM7 9H3C2.64961 9 2.31292 8.93972 2 8.82905V11.5C2 11.7761 2.22386 12 2.5 12H12.5C12.7761 12 13 11.7761 13 11.5V8.82915C12.6871 8.93978 12.3504 9 12 9H8V9.5C8 9.77614 7.77614 10 7.5 10C7.22386 10 7 9.77614 7 9.5V9Z"
									fill="currentColor" 
									fill-rule="evenodd" 
									clip-rule="evenodd">
								</path>
							</svg>
						}
						tailwindClasses="border-red-500 max-w-[500px]"
					/>

					<Card
						title="Supplier Management"
						description="Add, update, delete and list suppliers"
						href="/suppliers"
						icon={
							<svg 
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={0.5}
								stroke="currentColor"
								className="w-12 h-12 text-blue-400"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path 
									d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z"
									fill="currentColor" 
									fill-rule="evenodd" 
									clip-rule="evenodd">
								</path>
							</svg>
						}
						tailwindClasses="border-red-500 max-w-[500px]"
					/>

					<Card
						title="Order Management"
						description="Create, view, update and delete orders"
						href="/orders"
						icon={
							<svg
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={0.5}
								stroke="currentColor"
								className="w-12 h-12 text-blue-400"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z"
									fill="currentColor" 
									fill-rule="evenodd" 
									clip-rule="evenodd">
								</path>
							</svg>
						}
						tailwindClasses="border-red-500 max-w-[500px]"
					/>
				</ul>

				<section className="lg:px-std-wide px-std-sm relative" style={{ marginBottom: '20px' }}>
          			<Statistics />
        		</section>

				<section className="lg:px-std-wide px-std-sm relative" style={{ marginBottom: '20px' }}>
					<RecentOrders />
				</section>
				
				<section className="lg:px-std-wide px-std-sm relative">
					<LowStockProducts />
				</section>

				<svg
					width="3282"
					height="3901"
					viewBox="0 0 3282 3901"
					fill="none"
					className="absolute h-[70vh] w-[90vw] top-0 right-[5%] z-[-998] pointer-events-none overflow-hidden opacity-50"
				>
					<ellipse
						cx="1641.01"
						cy="1950.33"
						rx="1411.73"
						ry="2120.69" 
						transform="rotate(31.8368 1641.01 1950.33)"
						fill="url(#paint0_radial_16_27)"
					/>
					<defs>
						<radialGradient
							id="paint0_radial_16_27"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(1641.01 1950.33) rotate(90) scale(2120.69 1411.73)"
						>
							<stop stopColor="#FD8282" stopOpacity="0.19" />
							<stop
								offset="0.625"
								stopColor="#CB9797"
								stopOpacity="0.07"
							/>
							<stop
								offset="0.99"
								stopColor="#CB9797"
								stopOpacity="0"
							/>
						</radialGradient>
					</defs>
				</svg>
			</section>
		</main>
	);
}

function Card({
	title,
	description,
	href,
	icon,
	tailwindClasses = "",
}: {
	title: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	tailwindClasses?: string;
}) {
	return (
		<li
			className={
				"hover:translate-y-[-5px] overflow-hidden rounded-lg border bg-opacity-70 flex-grow dark:border-muted border-muted-foreground border-opacity-25 p-4 bg-transparent transition-all shadow-md " +
				tailwindClasses
			}
		>
			<Link href={href} className="">
				<div>{icon}</div>
				<div>
					<span className="text-xl font-semibold">{title}</span>
					<p>{description}</p>
				</div>
			</Link>
		</li>
	);
}
