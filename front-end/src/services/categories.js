import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const searchTopCategories = async params => {
  try {
    const data = await axios.get(`${API_BASE_URL}/api/category/tops`, { params });
    return data || [];
  } catch (error) {
    throw error;
  }
};

export const searchHomeCategories = async params => {
  try {
    const data = await axios.get(`${API_BASE_URL}/api/category/home`, { params });
    return data || [];
  } catch (error) {
    throw error;
  }
};
export const seachCategories = async (params) => {
  try {
    const data = await axios.get(`${API_BASE_URL}/api/categories`, {
      params: params
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDetailCategory = (category_id, params = {}) => axios.get(`${API_BASE_URL}/api/bnq_watches/category/${category_id}`, { params }).then(({ data }) => data || {}).catch((error) => {console.error('Lỗi khi gọi API:', error)});