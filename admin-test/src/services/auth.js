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

export const login = (body) => axios.post(`${API_BASE_URL}/api/admin/login`, body)
export const register = (body) => axios.post(`${API_BASE_URL}/api/admin/register`, body)
export const verifyUser = (body) => axios.post(`${API_BASE_URL}/api/verify-password`, body)
export const forgot = (body) => axios.post(`${API_BASE_URL}/api/forgot-password`, body)
export const getInfoUser = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/info-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response || null
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    throw error;
  }
};
export const updateProfile = (body) => axios.put(`${API_BASE_URL}/api/session/update`, body, getAuthHeader());
export const changePassword = (body) => axios.put(`${API_BASE_URL}/api/session/password`, body, getAuthHeader());

export const getAllUsers = async ({ search = '', page = 1, limit = 10 }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/get/accounts`, {
      params: {
        search,
        page,
        limit,
      },
      ...getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tài khoản:', error);
    throw error;
  }
};

export const createAccount = async (body) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/create/accounts`,
      body,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản:', error?.response?.data || error.message);
    throw error;
  }
};

export const updatePassword = async (body) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/session/password`,
      body,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error?.response?.data || error.message);
    throw error;
  }
};

export const lockAccount = async (userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/lock-account`,
      { userId },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi khóa tài khoản:', error?.response?.data || error.message);
    throw error;
  }
};
