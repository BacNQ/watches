import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

//Yêu thích
export const postAddFavorite = (body) => axios.post(`${API_BASE_URL}/api/favorite/product`, body, getAuthHeader())
export const getFavoProducts = (params) => axios.get(`${API_BASE_URL}/api/favorite/product/user`, { ...getAuthHeader(), params: params }).then(({ data }) => data || [])
export const searchFavorites = (params) => axios.get(`${API_BASE_URL}/api/favorite/products`, { ...getAuthHeader(), params: params }).then(({ data }) => data || {})
export const deleteFavorites = (body) => axios.post(`${API_BASE_URL}/api/favorite/product/delete`, body, getAuthHeader());

//Giỏ hàng
export const postAddCart = (body) => axios.post(`${API_BASE_URL}/api/cart`, body, getAuthHeader())
export const getCarts = (params) => axios.get(`${API_BASE_URL}/api/cart/user`, { ...getAuthHeader(), params: params }).then(({ data, unavailables }) => {
    return {
        availables: data || [],
        unavailables: unavailables || []
    }
})
export const removeCarts = (body) => axios.post(`${API_BASE_URL}/api/cart/remove`, body, getAuthHeader())
export const removeAllCarts = (body) => axios.post(`${API_BASE_URL}/api/cart/remove-all`, body, getAuthHeader())

//Danh mục
export const getCategory = (params) => axios.get(`${API_BASE_URL}/api/categories/get`, { params });
export const getHomeCategories = (params) => axios.get(`${API_BASE_URL}/api/category/home`, { params }).then(({ data }) => data || []).catch(() => { });

//Địa chỉ
export const getProvinces = () => axios.get(`${API_BASE_URL}/api/utility/provinces`).then(({ data }) => data || []);
export const getDistrict = (province_id) => axios.get(`${API_BASE_URL}/api/utility/districts`, { params: { province_id } }).then(({ data }) => data || []);
export const getWard = (district_id) => axios.get(`${API_BASE_URL}/api/utility/wards`, { params: { district_id } }).then(({ data }) => data || []);
export const getShop = () => axios.get(`${API_BASE_URL}/api/utility/shop`).then(({ data }) => data || []);
export const getService = (params) => axios.post(`${API_BASE_URL}/api/utility/services`, params).then(({ data }) => data || []);
export const calculateFee = (params) => axios.post(`${API_BASE_URL}/api/calculate-fee`, params).then(({ data }) => data || {});

//Thanh toán
export const paymentByZaloPay = (body) => axios.post(`${API_BASE_URL}/api/create-zalopay-order`, body, getAuthHeader())