import useSWR from 'swr';
import { Supplier } from '@/lib/types/inventory';
import { fetcher } from "@/lib/swr";

function useSuppliers() {
  const { data, error, isLoading, mutate } = useSWR<Supplier[]>('/inventory_api/suppliers', fetcher);

  return {
    suppliers: data,
    isLoading: isLoading,
    isError: error,
    refreshSuppliers: mutate
  };
}

export default useSuppliers;
