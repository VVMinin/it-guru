import type { AuthResponse } from '@/shared/types';
import { apiClient } from '@/shared/api/client';

export const login = (username: string, password: string) =>
  apiClient.post<AuthResponse>('/auth/login', { username, password });
