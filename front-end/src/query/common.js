import { useQuery } from '@tanstack/react-query';
import { getCountries, getProvinces, getStates, getDistricts, getCities, getWards,
} from '../services/common';

export const useCountries = (params, options={}) => useQuery({
    queryKey: ["country_search"], 
    queryFn: () => getCountries(params),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})

export const useProvinces = (params, options={}) => useQuery({
    queryKey: ["province_search"], 
    queryFn: () => getProvinces(params),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})

export const useStaties = (id, options={}) => useQuery({
    queryKey: ["states_search", id], 
    queryFn: () => getStates(id),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})
export const useDistricts = (id, options={}) => useQuery({
    queryKey: ["district_search", id], 
    queryFn: () => getDistricts(id),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})

export const useCities = (id, options={}) => useQuery({
    queryKey: ["city_search", id], 
    queryFn: () => getCities(id),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})

export const useWards = (id, options={}) => useQuery({
    queryKey: ["ward_search", id], 
    queryFn: () => getWards(id),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options
})
