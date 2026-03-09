import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Button, Typography, Tooltip, Empty, message } from 'antd';
import { PlusOutlined, ReloadOutlined, FilterOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useProductsStore } from '@/entities/product';
import { useAuthStore } from '@/entities/session';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatPrice } from '@/shared/lib/format';
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from '@/shared/config/constants';
import type { Product } from '@/shared/types';
import { AddProductModal } from '@/features/add-product';

const columns: ColumnsType<Product> = [
  {
    title: 'Наименование',
    dataIndex: 'title',
    key: 'title',
    sorter: {
      compare: (a, b) => a.title.localeCompare(b.title),
      multiple: 4,
    },
    showSorterTooltip: { title: 'Сортировка по наименованию' },
    render: (title: string, record) => (
      <div className="flex items-center gap-3">
        <img
          src={record.thumbnail}
          alt={title}
          className="w-10 h-10 rounded object-cover bg-gray-100"
        />
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-gray-400">{record.category}</div>
        </div>
      </div>
    ),
  },
  {
    title: 'Вендор',
    dataIndex: 'brand',
    key: 'brand',
    sorter: {
      compare: (a, b) => (a.brand ?? '').localeCompare(b.brand ?? ''),
      multiple: 3,
    },
    showSorterTooltip: { title: 'Сортировка по вендору' },
    render: (brand: string) => <span className="font-semibold">{brand ?? '—'}</span>,
  },
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'Оценка',
    dataIndex: 'rating',
    key: 'rating',
    sorter: {
      compare: (a, b) => a.rating - b.rating,
      multiple: 2,
    },
    showSorterTooltip: { title: 'Сортировка по оценке' },
    render: (rating: number) => (
      <span className={rating < 3 ? 'text-red-500' : ''}>{rating.toFixed(1)}/5</span>
    ),
  },
  {
    title: 'Цена, ₽',
    dataIndex: 'price',
    key: 'price',
    sorter: {
      compare: (a, b) => a.price - b.price,
      multiple: 1,
    },
    showSorterTooltip: { title: 'Сортировка по цене' },
    render: (price: number) => formatPrice(price),
  },
  {
    title: '',
    key: 'actions',
    width: 100,
    render: () => (
      <div className="flex gap-2">
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<PlusOutlined />}
        />
        <Button
          shape="circle"
          size="small"
          icon={<EllipsisOutlined />}
          onClick={() => console.log('У кнопки нет функционала')}
        />
      </div>
    ),
  },
];

export const ProductsPage = () => {
  const {
    products,
    localProducts,
    total,
    loading,
    error,
    page,
    pageSize,
    fetch: fetchProducts,
    setPage,
    setSearch,
  } = useProductsStore();

  const logout = useAuthStore((s) => s.logout);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [sortResetKey, setSortResetKey] = useState(0);
  const debouncedSearch = useDebounce(searchValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const resetSort = () => {
    setSortResetKey((prev) => prev + 1);
  };

  const handlePageChange = (pagination: TablePaginationConfig) => {
    if (pagination.current && pagination.current !== page) {
      setPage(pagination.current);
    }
  };

  const dataSource = useMemo(
    () => [...localProducts, ...products],
    [localProducts, products],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-center gap-6">
              <Typography.Title level={3} className="!mb-0 shrink-0">
                Товары
              </Typography.Title>
              <Input.Search
                placeholder="Найти"
                allowClear
                size="large"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="max-w-lg"
              />
              <Button type="link" className="ml-auto" onClick={logout}>
                Выйти
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography.Text strong>Все позиции</Typography.Text>
              <div className="flex items-center gap-3">
                <Tooltip title="Сбросить сортировку">
                  <Button
                    icon={<FilterOutlined />}
                    onClick={resetSort}
                  />
                </Tooltip>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchProducts()}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalOpen(true)}
                >
                  Добавить
                </Button>
              </div>
            </div>

            <Table<Product>
              key={sortResetKey}
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              onChange={(pagination) => handlePageChange(pagination)}
              rowSelection={{ type: 'checkbox' }}
              locale={{ emptyText: <Empty description="Товары не найдены" /> }}
              pagination={{
                current: page,
                pageSize,
                total: total + localProducts.length,
                showTotal: (t, range) =>
                  `Показано ${range[0]}-${range[1]} из ${t}`,
                showSizeChanger: false,
                defaultPageSize: PAGE_SIZE,
              }}
            />
          </div>
        </div>

        <AddProductModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};
