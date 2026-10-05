import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 切換路由時回到頁面頂端 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}
