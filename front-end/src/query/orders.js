import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { getOrderUser } from "../services/order";

const formatParams = (params) => {
    let from = dayjs().subtract(60, 'days').startOf('days').format();
    let to = dayjs().format();

    if(params.from && dayjs(params.from).isValid()) {
        from = dayjs(params.from).format();
    }
    if(params.to && dayjs(params.to).isValid()) {
        to = dayjs(params.to).format();
    }
    if(params.time && params.time.includes('_')) {
        let times = params.time.split('_')
        if(times.length === 2) {
          from = dayjs().subtract(times[0], times[1]).startOf('days').format();
        }
    }

    return {...params, from, to};
}

export const useSearch = (params, options={}) => useQuery({
    queryKey: ['ORDERS_SEARCH', JSON.stringify(params)],
    queryFn: () => getOrderUser(formatParams(params)),
    retry: false,
    retryOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    ...options
})