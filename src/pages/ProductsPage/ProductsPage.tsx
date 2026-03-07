import { useEffect } from 'react';
import { Typography, Button } from 'antd';
import { useProductsStore } from '@/store/productsStore';
import { useAuthStore } from '@/store/authStore';

export const ProductsPage = () => {
  const {
    loading,
    fetch: fetchProducts,
  } = useProductsStore();

  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && <div className="loadbar" />}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <Typography.Title level={3} className="!mb-0 shrink-0">
            Товары
          </Typography.Title>
          <Button type="link" className="ml-auto" onClick={logout}>
            Выйти
          </Button>
        </div>

        <div className="bg-white rounded-xl p-6">
          <Typography.Text strong>Все позиции</Typography.Text>
        </div>
      </div>
    </div>
  );
};
