import axios from 'axios';

const DEFAULT_MESSAGE = 'Произошла ошибка';

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || DEFAULT_MESSAGE;
  }
  return DEFAULT_MESSAGE;
};
