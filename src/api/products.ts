import type { ProductsResponse } from '@/types';
import { apiClient } from './client';

export const getProducts = (params: { limit: number; skip: number }) =>{
  apiClient.get<ProductsResponse>('/products', { params })};

export const searchProducts = (query: string, limit: number, skip: number) =>{
  apiClient.get<ProductsResponse>('/products/search', {
    params: { q: query, limit, skip },
  })};
