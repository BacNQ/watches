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

export const getAllProducts = ({ search = '', size = 20, page = 1, sortBy = 'created_date', sortOrder = 'desc' }) => {
    return axios
        .get(`${API_BASE_URL}/api/products`, {
            params: {
                search,
                size,
                page,
                sortBy,
                sortOrder,
            },
            ...getAuthHeader(),
        })
        .then(({ data }) => data || {})
        .catch((error) => {
            console.error('Lỗi khi gọi API getAllProducts:', error);
            return {};
        });
};

export const createProduct = (body) => axios.post(`${API_BASE_URL}/api/bnq_watches/create/product`, body, getAuthHeader())
export const updateProduct = (id, body) => axios.put(`${API_BASE_URL}/api/update/products/${id}`, body, getAuthHeader()).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API updateProduct:', error)});
export const deleteProduct = (id) => axios.delete(`${API_BASE_URL}/api/delete/products/${id}`, getAuthHeader()).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API deleteProduct:', error)});
export const hideProduct = (id) =>
  axios.put(`${API_BASE_URL}/api/hide/products/${id}`, {}, getAuthHeader())
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API hideProduct:', error);
    });

export const unhideProduct = (id) =>
  axios.put(`${API_BASE_URL}/api/unhide/products/${id}`, {}, getAuthHeader())
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API unhideProduct:', error);
    });


