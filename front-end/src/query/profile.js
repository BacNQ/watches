import { useQuery } from '@tanstack/react-query';
import { getAddress } from '../services/auth';

export const useAddress = (params) => useQuery({
    queryKey: ['USER_ADDRESS'],
    queryFn: () => getAddress(params),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false
})
