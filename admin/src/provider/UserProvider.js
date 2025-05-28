'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getInfoUser } from '../services/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    getInfoUser(token)
      .then(data => setUser(data?.data))
      .catch(err => console.error('Không thể lấy thông tin user:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
