import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchAdminIssues } from '../api';

const STORAGE_KEY = 'hsps-admin-token';
const AuthContext = createContext(null);

/**
 * 簡易後台登入狀態管理
 * - 密碼於登入時透過 getAdminData 向 GAS 驗證，成功才視為登入。
 * - 使用 sessionStorage：關閉分頁即自動登出，避免共用電腦殘留。
 */
export function AuthProvider({ children }) {
  const [password, setPassword] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');

  const login = useCallback(async (pwd) => {
    const data = await fetchAdminIssues(pwd); // 密碼錯誤時 api 會 throw
    sessionStorage.setItem(STORAGE_KEY, pwd);
    setPassword(pwd);
    return data;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPassword('');
  }, []);

  const value = useMemo(
    () => ({ password, isAuthenticated: Boolean(password), login, logout }),
    [password, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必須在 <AuthProvider> 內使用');
  return ctx;
}

/** 受保護路由：未登入時導向 /login，並記住原本要去的頁面 */
export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
