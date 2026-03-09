import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.png';
import { useAuthStore } from '@/entities/session';
import { PageLayout } from '@/shared/ui/PageLayout';
import { FormField } from '@/shared/ui/FormField';
import type { LoginFormValues } from '@/shared/types';

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
  remember: yup.boolean().defined(),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuth } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { username: '', password: '', remember: false },
  });

  useEffect(() => {
    if (isAuth) navigate('/products', { replace: true });
  }, [isAuth, navigate]);

  const onSubmit = (values: LoginFormValues) => {
    login(values.username, values.password, values.remember);
  };

  return (
    <PageLayout loading={loading}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Logo" className="w-12 h-12 mb-4" />
            <Typography.Title level={3} className="!mb-1">
              Добро пожаловать!
            </Typography.Title>
            <Typography.Text type="secondary">
              Пожалуйста, авторизуйтесь
            </Typography.Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormField label="Логин" error={errors.username}>
                {(id) => (
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id={id}
                        onChange={(e) => field.onChange(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                        maxLength={20}
                        prefix={<UserOutlined className="text-gray-400" />}
                        allowClear
                        size="large"
                        status={errors.username ? 'error' : undefined}
                        aria-invalid={!!errors.username}
                        placeholder="Введите логин"
                      />
                    )}
                  />
                )}
              </FormField>
            </div>

            <div className="mb-4">
              <FormField label="Пароль" error={errors.password}>
                {(id) => (
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        id={id}
                        onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))}
                        maxLength={16}
                        prefix={<LockOutlined className="text-gray-400" />}
                        size="large"
                        status={errors.password ? 'error' : undefined}
                        aria-invalid={!!errors.password}
                        placeholder="Введите пароль"
                      />
                    )}
                  />
                )}
              </FormField>
            </div>

            {error && (
              <p role="alert" className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="mb-6">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    Запомнить данные
                  </Checkbox>
                )}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="!rounded-lg !h-12"
            >
              Войти
            </Button>

            <div className="text-center mt-6">
              <Typography.Text type="secondary">или</Typography.Text>
            </div>
            <div className="text-center mt-2">
              <Typography.Text type="secondary">Нет аккаунта? </Typography.Text>
              <Typography.Link>Создать</Typography.Link>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
