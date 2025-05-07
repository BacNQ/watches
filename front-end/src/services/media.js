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

export const uploadImage = (body, conf) => axios.post(`${API_BASE_URL}/api/upload/file/user`, body, conf, getAuthHeader());
