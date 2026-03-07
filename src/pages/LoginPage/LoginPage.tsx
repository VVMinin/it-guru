import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
  } = useForm({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (values: { username: string; password: string }) => {
    console.log(values);
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
                  placeholder="Введите логин"
                />
              )}
            />
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
                  placeholder="Введите пароль"
                />
              )}
            />
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
