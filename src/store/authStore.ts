import { create } from 'zustand';
import { login as loginApi } from '@/api/auth';
import type { User } from '@/types';
import axios from 'axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuth: false,
  loading: false,
  error: null,

  login: async (username, password, remember) => {
    set({ loading: true, error: null });
    try {
      const { data } = await loginApi(username, password);

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('accessToken', data.accessToken);

      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      };

      set({ user, token: data.accessToken, isAuth: true, loading: false });
    } catch (err) {
      let message = 'Произошла ошибка';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      set({ loading: false, error: message });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    set({ user: null, token: null, isAuth: false });
  },

  checkAuth: () => {
    const token =
      sessionStorage.getItem('accessToken') ||
      localStorage.getItem('accessToken');

    if (token) {
      set({ token, isAuth: true });
    }
  },
}));
