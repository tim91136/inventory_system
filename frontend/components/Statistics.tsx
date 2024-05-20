"use client";

import React, { useEffect, useState } from 'react';
import useProducts from '@/lib/hooks/useProduct';
import useSuppliers from '@/lib/hooks/useSupplier';
import useOrders from '@/lib/hooks/useOrder';

export default function Statistics() {
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const { orders } = useOrders();

  const [totalActiveOrders, setTotalActiveOrders] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    if (orders && suppliers && products) {
      const activeOrdersCount = orders.filter(order => order.is_active).length;
      const totalStockCount = products.reduce((sum, product) => sum + product.quantity, 0);

      setTotalActiveOrders(activeOrdersCount);
      setTotalSuppliers(suppliers.length);
      setTotalProducts(products.length);
      setTotalStock(totalStockCount);
    }
  }, [orders, suppliers, products]);

  return (
    <div className="rounded-lg border bg-opacity-70 dark:border-muted border-muted-foreground border-opacity-25 p-4 bg-transparent transition-all shadow-md max-w-[1000px] mx-auto">
			<div className="flex justify-between flex-wrap gap-2">
				<div className="flex items-center gap-1">
                <svg 
							fill="none"
							viewBox="-6 -3 24 24"
							strokeWidth={0.1}
							stroke="currentColor"
							className="w-10 h-10 text-yellow-600"
							xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 1C11.7761 1 12 1.22386 12 1.5V13.5C12 13.7761 11.7761 14 11.5 14C11.2239 14 11 13.7761 11 13.5V1.5C11 1.22386 11.2239 1 11.5 1ZM9.5 3C9.77614 3 10 3.22386 10 3.5V13.5C10 13.7761 9.77614 14 9.5 14C9.22386 14 9 13.7761 9 13.5V3.5C9 3.22386 9.22386 3 9.5 3ZM13.5 3C13.7761 3 14 3.22386 14 3.5V13.5C14 13.7761 13.7761 14 13.5 14C13.2239 14 13 13.7761 13 13.5V3.5C13 3.22386 13.2239 3 13.5 3ZM5.5 4C5.77614 4 6 4.22386 6 4.5V13.5C6 13.7761 5.77614 14 5.5 14C5.22386 14 5 13.7761 5 13.5V4.5C5 4.22386 5.22386 4 5.5 4ZM1.5 5C1.77614 5 2 5.22386 2 5.5V13.5C2 13.7761 1.77614 14 1.5 14C1.22386 14 1 13.7761 1 13.5V5.5C1 5.22386 1.22386 5 1.5 5ZM7.5 5C7.77614 5 8 5.22386 8 5.5V13.5C8 13.7761 7.77614 14 7.5 14C7.22386 14 7 13.7761 7 13.5V5.5C7 5.22386 7.22386 5 7.5 5ZM3.5 7C3.77614 7 4 7.22386 4 7.5V13.5C4 13.7761 3.77614 14 3.5 14C3.22386 14 3 13.7761 3 13.5V7.5C3 7.22386 3.22386 7 3.5 7Z"
                        fill="currentColor" 
                        fill-rule="evenodd" 
                        clip-rule="evenodd">
                        </path>
                </svg>
					<h2 className="text-xl font-semibold">Statistics</h2>
				</div>
			</div>
      <div className="flex justify-between">
        <StatCard title="Active Orders" value={totalActiveOrders} />
        <StatCard title="Suppliers" value={totalSuppliers} />
        <StatCard title="Products" value={totalProducts} />
        <StatCard title="Total Stock" value={totalStock} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="flex-1 rounded-lg border bg-opacity-70 dark:border-muted border-muted-foreground border-opacity-25 p-2 bg-transparent transition-all shadow-md  text-center mx-2">
      <div className="text-l font-semibold">{title}</div>
      <div className="text-2l mt-2">{value}</div>
    </div>
  );
}

