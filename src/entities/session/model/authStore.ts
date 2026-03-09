import { create } from 'zustand';
import { login as loginApi } from '../api/auth';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { TOKEN_KEY } from '@/shared/config/constants';
import type { User } from '@/shared/types';

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
      storage.setItem(TOKEN_KEY, data.accessToken);

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
      set({ loading: false, error: getErrorMessage(err) });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null, isAuth: false });
  },

  checkAuth: () => {
    const token =
      sessionStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(TOKEN_KEY);

    if (token) {
      set({ token, isAuth: true });
    }
  },
}));
