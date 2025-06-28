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

export const getOrderUser = (params) => axios.get(`${API_BASE_URL}/api/orders/user`, { ...getAuthHeader(), params: params }).then((data) => data || {})
export const cancelOrder = (orderId, note) =>
  axios.put(
    `${API_BASE_URL}/api/orders/request/cancel`,
    { orderId, note },
    getAuthHeader()
  )
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API cancelOrder:', error);
      throw error;
    });