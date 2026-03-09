import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useAuthStore } from '@/entities/session';
import { THEME_COLOR } from '@/shared/config/constants';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { LoginPage } from '@/pages/login';
import { ProductsPage } from '@/pages/products';

export const App = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: THEME_COLOR } }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};
