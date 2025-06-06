import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Hàm lấy header Authorization
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Hàm lấy tất cả đơn hàng
export const getAllOrders = (params) =>
  axios.get(`${API_BASE_URL}/api/orders/all`, { ...getAuthHeader(), params: params })
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API getAllOrders:', error);
      throw error;
    });

// Hàm cập nhật trạng thái đơn hàng
export const updateOrderStatus = (orderId, status) =>
  axios.put(
    `${API_BASE_URL}/api/orders/status`,
    { orderId, status },
    getAuthHeader()
  )
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API updateOrderStatus:', error);
      throw error;
    });

// Hàm hủy đơn hàng
export const cancelOrder = (orderId, note) =>
  axios.put(
    `${API_BASE_URL}/api/orders/cancel`,
    { orderId, note },
    getAuthHeader()
  )
    .then(({ data }) => data || {})
    .catch((error) => {
      console.error('Lỗi khi gọi API cancelOrder:', error);
      throw error;
    });

// Hàm xuất hóa đơn
export const generateInvoice = (orderId) => {
  return axios.get(`${API_BASE_URL}/api/orders/invoice/${orderId}`, {
    ...getAuthHeader(),
    responseType: 'blob',
  });
};
