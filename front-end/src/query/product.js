// import { useQuery } from '@tanstack/react-query';
// import { checkIsLoggedIn } from '../lib/authorization-atom';
// import { getCarts, getFavoProducts} from '../services/favourite'

// export const useCarts = (params, option) => useQuery({
//     queryKey:['CART_PRODUCT'],
//     queryFn: () => getCarts(params),
//     retry: false,
//     retryOnMount: false,
//     refetchOnWindowFocus: false,
//     enabled: checkIsLoggedIn()
// })
// export const useFavProducts = (params, option) => useQuery({
//     queryKey:['FAVORITE_PRODUCT'],
//     queryFn: () => getFavoProducts(params),
//     retry: false,
//     staleTime: 100000,
//     retryOnMount: false,
//     refetchOnWindowFocus: false,
//     enabled: checkIsLoggedIn()
// })
