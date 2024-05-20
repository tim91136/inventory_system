import useSWR, {SWRConfig, MutatorCallback, MutatorOptions} from 'swr'
import { fetcher } from '@lib/swr';
import { UserMe } from '../types/auth/user';

class CustomError extends Error {
    status: number;
  
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }


const userFetcher = async (...args) => {
    const res = await fetch(...args);

    if (!res.ok) {
        const error = new CustomError("Unauthorized", 401)
        throw error;
    }

    return res.json()

}

export default function useUser() {

    const {data, error, isLoading, mutate} = useSWR<UserMe>(`/inventory_api/auth/me`, userFetcher)

    const loading = !data && !error
    const loggedOut: boolean = error && error.status === 401
    

    return {
        loading,
        loggedOut,
        error,
        user: data,
        mutate
    }
}
