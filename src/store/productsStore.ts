import { create } from 'zustand';
import { getProducts, searchProducts } from '@/api/products';
import type { Product } from '@/types';

interface ProductsState {
  products: Product[];
  total: number;
  loading: boolean;
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
  page: 1,
  pageSize: 20,
  search: '',
  localProducts: [],

  fetch: async () => {
    const { page, pageSize, search } = get();
    set({ loading: true });

    try {
      const skip = (page - 1) * pageSize;

      const { data } = search
        ? await searchProducts(search, pageSize, skip)
        : await getProducts({ limit: pageSize, skip });

      set({ products: data.products, total: data.total, loading: false });
    } catch {
      set({ loading: false });
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
