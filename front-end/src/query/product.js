import { useQuery } from '@tanstack/react-query';
import { checkIsLoggedIn } from '../lib/check-login';
import { getFavoProducts, getCarts, searchFavorites } from '../services/common'
import { searchProducts } from '@/services/product';

export const useSearchProducts = (keyword, params = {}, options = {}) => useQuery({
    queryKey: ['SEARCH_PRODUCTS', keyword, params],
    queryFn: () => searchProducts(keyword, params),
    enabled: !!keyword,
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    ...options,
});

export const useCarts = (params, option) => useQuery({
    queryKey: ['CART_PRODUCT'],
    queryFn: () => getCarts(params),
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    enabled: checkIsLoggedIn()
})
export const useFavProducts = (params, option) => useQuery({
    queryKey: ['FAVORITE_PRODUCT'],
    queryFn: () => getFavoProducts(params),
    retry: false,
    staleTime: 100000,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    enabled: checkIsLoggedIn()
})

export const useFavProductsSearch = (params) => useQuery({
    queryKey: ['USER_FA_PRODUCT', params],
    queryFn: () => searchFavorites(params),
    retry: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    enabled: checkIsLoggedIn()
})
