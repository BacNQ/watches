import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const getProduct = (slug) =>axios.get(`${API_BASE_URL}/api/bnq_watches/product/${slug}`).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API getProduct:', error)});
export const getProductTrending = () =>axios.get(`${API_BASE_URL}/api/bnq_watches/products/trending`).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API getProductTrending:', error)});
export const getProductLuxury = () =>axios.get(`${API_BASE_URL}/api/bnq_watches/products/luxury`).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API:', error)});
