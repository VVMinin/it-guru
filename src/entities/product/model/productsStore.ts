import { create } from 'zustand';
import { getProducts, searchProducts } from '../api/products';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { PAGE_SIZE } from '@/shared/config/constants';
import type { Product } from '@/shared/types';

interface ProductsState {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  search: string;
  localProducts: Product[];
  fetch: () => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  addLocalProduct: (product: Product) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  loading: false,
  error: null,
  page: 1,
  pageSize: PAGE_SIZE,
  search: '',
  localProducts: [],

  fetch: async () => {
    const { page, pageSize, search } = get();
    set({ loading: true, error: null });

    try {
      const skip = (page - 1) * pageSize;

      const { data } = search
        ? await searchProducts(search, pageSize, skip)
        : await getProducts({ limit: pageSize, skip });

      set({ products: data.products, total: data.total, loading: false });
    } catch (err) {
      set({ loading: false, error: getErrorMessage(err) });
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetch();
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetch();
  },

  addLocalProduct: (product) => {
    set((state) => ({ localProducts: [product, ...state.localProducts] }));
  },
}));
