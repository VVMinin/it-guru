import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { ProductsPage } from '@/pages/ProductsPage/ProductsPage';

export const App = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#242EDB' } }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};
