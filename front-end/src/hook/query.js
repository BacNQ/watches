"use client"
import queryString from 'query-string';
import { usePathname, useParams, useRouter, useSearchParams } from 'next/navigation';

export const useQuery = () => {
    const query = useParams()
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    const onPush = (option) => {
        if(option && (option.query || option.pathname)) {
            if(option.pathname && option.query) {
                router.push(`${option.pathname}?${queryString.stringify(option.query)}`)
            } if(option.pathname) {
                router.push(`${option.pathname}`)
            } else if(option.query) {
                router.push(`${pathname}?${queryString.stringify(option.query)}`)
            } else {
                router.push(pathname)
            }
        } else if (typeof option === 'string') {
            router.push(option);
        } else {
            router.push(pathname)
        }
    }
    
    search.forEach((value, key) => {
        if(value !== 'all') {
            query[key] = value;
        } else {
            query[key] = '';
        }
    });

    let asPathname = pathname;
    if(query && Object.keys(query).length > 0) {
        asPathname = `${pathname}?${queryString.stringify(query)}`
    }

    return { query, search, router, pathname, push: onPush, asPathname };
}
