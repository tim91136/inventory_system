import useSWR from 'swr';
import { Order } from '@/lib/types/inventory';
import { fetcher } from "@/lib/swr";

function useOrders() {
    const { data, error, isLoading, mutate } = useSWR<Order[]>(
		`/inventory_api/orders`,
		fetcher
	);

  return {
    orders: data,
    isLoading: isLoading,
    isError: error,
    refreshOrders: mutate
  };
}

export default useOrders;