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
  DialogFooter,
  DialogClose,
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
import { Order } from "@/lib/types/inventory";
import ChangeOrderDialogForm from "./ChangeOrder";
import NewOrderForm from "./NewOrder";
import useOrders from "@/lib/hooks/useOrder";

const statuses = [
  { value: "active", label: "Active", color: "#9EB1FF" },
  { value: "done", label: "Done", color: "green" },
  { value: "canceled", label: "Canceled", color: "orange" },
  { value: "archived", label: "Archived", color: "violet" },
];

export default function AllOrders() {
  const { orders, isError, isLoading, refreshOrders } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState({});
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  async function handleOrderDelete(orderId) {
    const response = await fetch(`/inventory_api/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      toast.error(`Failed to delete order. ${response.status} Please try again.`);
      return;
    }
    toast.success("Successfully deleted order.");
    refreshOrders();
  }

  async function handleStatusChange(orderId, newStatus) {
    const response = await fetch(`/inventory_api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      toast.error(`Failed to change order status. ${response.status} Please try again.`);
      return;
    }
    toast.success("Successfully changed order status.");
    refreshOrders();
  }

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

  const filteredOrders = orders
    ? orders.filter(order => {
        if (filterStatus === 'all') return !order.is_archived;
        if (filterStatus === 'active') return order.is_active;
        if (filterStatus === 'done') return order.is_done;
        if (filterStatus === 'canceled') return order.is_canceled;
        if (filterStatus === 'archived') return order.is_archived;
        return true;
      })
    : [];

  return (
    <div className="rounded-md border-muted shadow-md border p-4">
      <div className="flex justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-semibold">Orders</h2>
          <p className="text-muted-foreground">
            An order is a request for a product / products by a customer.
          </p>
        </div>
        <NewOrderForm
          onSubmit={() => {
            refreshOrders();
          }}
        />
      </div>
      <br />
      <ul>{isLoading && <li>Loading Orders...</li>}</ul>
      <Table>
        <TableCaption>Current orders of all statuses except archived.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>
			<div className="flex items-center relative">
                Status
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'absolute', left: '8px', pointerEvents: 'none' }}
                  >
                    <path
                      d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                      backgroundColor: '#333',
                      color: 'white',
                      padding: '4px 8px 4px 24px',  // Adjust padding to accommodate the icon
                      border: '1px solid #555',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="all">All</option>
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders &&
            filteredOrders.map((order) => (
              <TableRow key={order.id} className="font-medium">
                <TableCell>
                  {order.order_products.map((orderProduct, index) => (
                    <React.Fragment key={orderProduct.product.id}>
                      {orderProduct.product.name}
                      {index < order.order_products.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </TableCell>

                <TableCell>
                  {order.order_products.map((orderProduct, index) => (
                    <React.Fragment key={orderProduct.product.id}>
                      {orderProduct.quantity}
                      {index < order.order_products.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </TableCell>

                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex gap-1 items-center">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Order</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <ChangeOrderDialogForm
                        orderId={order.id}
                        onSubmit={() => {
                          refreshOrders();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell>
                  <select
                    value={selectedStatus[order.id] || getStatus(order).props.children.toLowerCase()}
                    onChange={(e) => {
                      setOrderToUpdate(order);
                      setNewStatus(e.target.value);
                    }}
                    style={{
                      backgroundColor: '#111',
                      color: getStatus(order).props.style.color,
                      padding: '4px 8px',
                      border: '1px solid #555',
                      borderRadius: '4px',
                    }}
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value} style={{ color: status.color }}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </TableCell>

                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <SensorCreatedDelta created={order.created} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{new Date(order.created).toLocaleString()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

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
                          Are you sure you want to delete this order?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the order.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            variant="outline"
                            className="bg-destructive text-destructive-foreground hover:opacity-70"
                            onClick={() => {
                              handleOrderDelete(order.id);
                            }}
                          >
                            Delete Permanently
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {orderToUpdate && (
        <Dialog open={true} onOpenChange={() => setOrderToUpdate(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change the status of this order to "{newStatus}"?
                {newStatus === 'archived' && (
                  <p>This will make the order stay in the database but disappear from this list.</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} onClick={() => setOrderToUpdate(null)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleStatusChange(orderToUpdate.id, newStatus);
                  setOrderToUpdate(null);
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
