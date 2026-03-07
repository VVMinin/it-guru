import type { AuthResponse } from '@/types';
import { apiClient } from './client';

export const login = (username: string, password: string) =>{
  apiClient.post<AuthResponse>('/auth/login', { username, password })};
