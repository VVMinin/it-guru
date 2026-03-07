import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/authStore';

const schema = yup.object({
  username: yup
    .string()
    .min(4, 'Минимум 4 символа')
    .max(20, 'Максимум 20 символов')
    .matches(/^[a-zA-Z0-9]*$/, 'Только латиница и цифры')
    .required('Введите логин'),
  password: yup
    .string()
    .max(16, 'Максимум 16 символов')
    .required('Введите пароль'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => {
    if (isAuth) navigate('/products', { replace: true });
  }, [isAuth, navigate]);

  const onSubmit = (values: { username: string; password: string }) => {
    login(values.username, values.password, false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10">
        <div className="flex flex-col items-center mb-8">
          <Typography.Title level={3} className="!mb-1">
            Добро пожаловать!
          </Typography.Title>
          <Typography.Text type="secondary">
            Пожалуйста, авторизуйтесь
          </Typography.Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Логин</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                  maxLength={20}
                  prefix={<UserOutlined className="text-gray-400" />}
                  allowClear
                  size="large"
                  status={errors.username ? 'error' : undefined}
                  placeholder="Введите логин"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))}
                  maxLength={16}
                  prefix={<LockOutlined className="text-gray-400" />}
                  size="large"
                  status={errors.password ? 'error' : undefined}
                  placeholder="Введите пароль"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            className="!rounded-lg !h-12"
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};
