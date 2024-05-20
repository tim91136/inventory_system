import useSWR from 'swr';
import { Product } from '@/lib/types/inventory';
import { fetcher } from "@/lib/swr";

function useProducts() {
    const { data, error, isLoading, mutate } = useSWR<Product[]>(
		`/inventory_api/products`,
		fetcher
	);

  return {
    products: data,
    isLoading: isLoading,
    isError: error,
    refreshProducts: mutate
  };
}

export default useProducts;