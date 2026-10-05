import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { NeuButton, NeuInput } from './NeuComponents';
import { NeuCard, Spinner, Chevron } from './NeuExtras';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('請輸入管理密碼。');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message?.includes('連線') ? err.message : '密碼錯誤或無權限，請重新輸入。');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neu-base px-5 py-12">
      <div className="w-full max-w-sm">
        <NeuCard className="p-8 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-neu-pressed">
            <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
            </svg>
          </div>

          <header className="mt-6 text-center">
            <h1 className="text-xl font-bold text-neu-text">委員管理後台</h1>
            <p className="mt-2 text-sm text-slate-400">請輸入管理密碼以繼續</p>
          </header>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
            <NeuInput
              id="admin-password"
              type="password"
              label="管理密碼"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoFocus
            />

            {error && (
              <p role="alert" className="pl-1 text-sm text-rose-700/80">
                {error}
              </p>
            )}

            <NeuButton id="btn-login" type="submit" disabled={loading} className="w-full">
              <span className="inline-flex items-center justify-center gap-3">
                {loading && <Spinner />}
                {loading ? '驗證中…' : '登入'}
              </span>
            </NeuButton>
          </form>
        </NeuCard>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-neu-text"
          >
            <Chevron direction="left" />
            返回佈告欄
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
