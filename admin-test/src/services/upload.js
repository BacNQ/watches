import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');

  return axios.post(`${API_BASE_URL}/api/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  })
    .then(({ data }) => data)
    .catch((error) => {
      console.error('Lỗi khi gọi API uploadImage:', error);
      throw error;
    });
};


