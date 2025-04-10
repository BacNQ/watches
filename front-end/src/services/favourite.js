import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const postAddFavorite = (body) => axios.post(`${API_BASE_URL}/api/favorite/product`, body)
