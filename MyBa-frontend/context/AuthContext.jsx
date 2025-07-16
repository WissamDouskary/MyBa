import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'config';
export const AuthContext = createContext({
  userToken: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkTokenValidity = async (token) => {
    try {
      const res = await fetch(API_URL + '/check-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return res.ok && data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const valid = await checkTokenValidity(token);
        if (valid) {
          setUserToken(token);
        } else {
          await AsyncStorage.removeItem('userToken');
          setUserToken(null);
        }
      }
    } catch (e) {
      console.log('Error checking token:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    setUserToken(token);
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'accountData']);
      setUserToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
