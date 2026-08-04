/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { getAdminProfile } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Staff Auth State
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cma_user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cma_token') || null);
  const [adminProfileReady, setAdminProfileReady] = useState(() => !localStorage.getItem('cma_token'));

  // Citizen Auth State
  const [citizen, setCitizen] = useState(() => {
    const c = localStorage.getItem('cma_citizen');
    return c ? JSON.parse(c) : null;
  });
  const [citizenToken, setCitizenToken] = useState(() => localStorage.getItem('cma_citizen_token') || null);

  // Staff Login/Logout
  const login = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('cma_user', JSON.stringify(userData));
    localStorage.setItem('cma_token', tokenStr);
    setAdminProfileReady(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cma_user');
    localStorage.removeItem('cma_token');
    setAdminProfileReady(true);
  };

  // Citizen Login/Logout
  const citizenLogin = (citizenData, tokenStr) => {
    setCitizen(citizenData);
    setCitizenToken(tokenStr);
    localStorage.setItem('cma_citizen', JSON.stringify(citizenData));
    localStorage.setItem('cma_citizen_token', tokenStr);
  };

  const citizenLogout = () => {
    setCitizen(null);
    setCitizenToken(null);
    localStorage.removeItem('cma_citizen');
    localStorage.removeItem('cma_citizen_token');
  };

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let cancelled = false;

    getAdminProfile()
      .then((response) => {
        if (cancelled) return;
        const refreshedUser = response.data?.data;
        if (refreshedUser) {
          setUser(refreshedUser);
          localStorage.setItem('cma_user', JSON.stringify(refreshedUser));
        }
      })
      .catch((error) => {
        if (cancelled) return;
        const code = error.response?.data?.code;
        if (error.response?.status === 401 || code === 'account_disabled' || code === 'admin_access_required') {
          setUser(null);
          setToken(null);
          localStorage.removeItem('cma_user');
          localStorage.removeItem('cma_token');
        }
      })
      .finally(() => {
        if (!cancelled) setAdminProfileReady(true);
      });

    return () => { cancelled = true; };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn: !!token,
        adminProfileReady,
        
        citizen,
        citizenToken,
        citizenLogin,
        citizenLogout,
        isCitizenLoggedIn: !!citizenToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
