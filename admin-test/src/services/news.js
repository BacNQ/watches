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

export const getAllNews = (params) => axios.get(`${API_BASE_URL}/api/news`, { ...getAuthHeader(), params: params }).then(({ data }) => data || {}).catch(() => { });
export const createNews = (data) => axios.post(`${API_BASE_URL}/api/news`, data, getAuthHeader()).then(({ data }) => data || {}).catch(() => ({}));
export const updateNews = (id, data) => axios.put(`${API_BASE_URL}/api/news/${id}`, data, getAuthHeader()).then(({ data }) => data || {}).catch(() => ({}));
export const deleteNews = (id) => axios.delete(`${API_BASE_URL}/api/news/${id}`, getAuthHeader()).then(({ data }) => data || {}).catch(() => ({}));

