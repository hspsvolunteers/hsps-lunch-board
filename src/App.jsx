import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './context/AuthContext';
import NoticeBoard from './components/NoticeBoard';
import IssueForm from './components/IssueForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';

/**
 * 使用 HashRouter 確保在 GitHub Pages 等純靜態伺服器上：
 * 1. 重新整理任何分頁（例如 /#/admin、/#/submit）絕不會引發伺服器 404
 * 2. 子目錄路徑無需額外伺服器重寫設定，完全免除白屏風險
 */
export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<NoticeBoard />} />
          <Route path="/submit" element={<IssueForm />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
