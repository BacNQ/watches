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

export const getDashboardStats = () => axios.get(`${API_BASE_URL}/api/stats`, getAuthHeader()).then(({ data }) => data || {}).catch(() => {});

export const getRevenueByDay = async ({ month, year }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/revenue/by-day`,
      {
        params: { month, year },
        ...getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo ngày:', error?.response?.data || error.message);
    return [];
  }
};

export const getRevenueByMonth = async ({ year }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/revenue/by-month`,
      {
        params: { year },
        ...getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy doanh thu theo tháng:', error?.response?.data || error.message);
    return [];
  }
};

export const getOrderByStatus = () => axios.get(`${API_BASE_URL}/api/order-by-status`, getAuthHeader()).then(({ data }) => data || {}).catch(() => {});

export const getTopSoldProducts = () => axios.get(`${API_BASE_URL}/api/top-products`, getAuthHeader()).then(({ data }) => data || {}).catch(() => {});

export const getLowStockProducts = () => axios.get(`${API_BASE_URL}/api/low-stock`, getAuthHeader()).then(({ data }) => data || {}).catch(() => {});

export const getRecentOrders = () => axios.get(`${API_BASE_URL}/api/orders/recent`, getAuthHeader()).then(({ data }) => data || {}).catch(() => {});


