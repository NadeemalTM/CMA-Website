import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Staff Auth State
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('cma_user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cma_token') || null);

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
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cma_user');
    localStorage.removeItem('cma_token');
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

  // Interceptor auto-refresh headers when token changes
  useEffect(() => {
    // Both tokens will be intercepted properly in api.js
  }, [token, citizenToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoggedIn: !!token,
        
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
