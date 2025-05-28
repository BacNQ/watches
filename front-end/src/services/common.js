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
export const getFavoProducts = (params) => axios.get(`${API_BASE_URL}/api/favorite/product/user`, {...getAuthHeader(), params: params}).then(({ data }) => data || [])
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
export const getHomeCategories = (params) => axios.get(`${API_BASE_URL}/api/category/home`, { params }).then(({ data }) => data || []).catch(() => {});

//Địa chỉ
export const getCountries = () => axios.get(`${API_BASE_URL}/api/utility/countries`);
export const getProvinces = () => axios.get(`${API_BASE_URL}/api/utility/provinces`).then(({ data }) => data || []);
export const getStates = (id) => axios.get(`${API_BASE_URL}/api/utility/states/${id}`).then(({ data }) => data || []);
export const getDistricts = (id) => axios.get(`${API_BASE_URL}/api/utility/district/${id}`).then(({ data }) => data || []);
export const getCities = (id) => axios.get(`${API_BASE_URL}/api/utility/cities/${id}`).then(({ data }) => data || []);
export const getWards = (id) => axios.get(`${API_BASE_URL}/api/utility/ward/${id}`).then(({ data }) => data || []);

//Thanh toán
export const paymentByZaloPay = (body) => axios.post(`${API_BASE_URL}/api/create-zalopay-order`, body, getAuthHeader())