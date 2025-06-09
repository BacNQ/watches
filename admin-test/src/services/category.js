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

export const getAllCategories = (params) => axios.get(`${API_BASE_URL}/api/category/get/all`, { ...getAuthHeader(), params: params }).then(({ data }) => data || {}).catch(() => { });
export const updateCategory = (id, data) =>
  axios
    .put(`${API_BASE_URL}/api/category/${id}`, data, getAuthHeader())
    .then(({ data }) => data || {})
    .catch((err) => {
      console.error('Update category error:', err);
      throw err;
    });

export const addCategory = (data) =>
  axios
    .post(`${API_BASE_URL}/api/category`, data, getAuthHeader())
    .then(({ data }) => data || {})
    .catch((err) => {
      console.error('Add category error:', err);
      throw err.response?.data || err;
    });

export const deleteCategory = (id) =>
  axios
    .delete(`${API_BASE_URL}/api/category/delete/${id}`, getAuthHeader())
    .then(({ data }) => data || {})
    .catch((err) => {
      console.error('Delete category error:', err);
      throw err.response?.data || err;
    });


