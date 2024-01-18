import { notification } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { COOKIE_JWT } from 'utils/constants';
import { getCookie, removeCookie } from 'utils/cookie';
import { getProfile, getFunctions } from 'services/auth.service';

const AuthContext = createContext({
  initializing: false,
  user: null,
  error: null,
  setting: {
    navTheme: 'dark',
    layout: 'sidemenu',
    fixedHeader: true,
  },
  setSetting: () => {},
  setUser: () => {},
  logout: () => {},
  collapsed: false,
  setCollapsed: () => {},
});
AuthContext.displayName = 'AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [setting, setSetting] = useState({
    navTheme: 'dark',
    layout: 'sidemenu',
    fixedHeader: true,
  });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setInitializing(true);
    try {
      if (getCookie(COOKIE_JWT)) {
        let profileData = await getProfile();
        if (!profileData.isAdministrator) {
          let functions = await getFunctions();
          profileData.functions = functions;
        }
        setUser(profileData);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };
  const logout = () => {
    try {
      removeCookie(COOKIE_JWT);
      setUser(null);
    } catch (error) {}
  };

  const value = {
    user,
    setUser,
    initializing,
    setInitializing,
    error,
    setError,
    logout,
    setting,
    setSetting,
    collapsed,
    setCollapsed,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
