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

//Address user
export const getAddress = (params) => axios.get(`${API_BASE_URL}/api/user/address/user`, { ...getAuthHeader(), params: params }).then(({ data }) => data || [])
export const saveAddress = (body) => body.id ? axios.put(`${API_BASE_URL}/api/user/address/edit/${body.id}`, body, getAuthHeader()) : axios.post("${API_BASE_URL}/api/user/address/add", body, getAuthHeader());
export const removeAddress = (id) => axios.delete(`${API_BASE_URL}/api/user/address/remove/${id}`, getAuthHeader());