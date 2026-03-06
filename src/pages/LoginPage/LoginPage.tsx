import { Typography } from 'antd';

export const LoginPage = () => {
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
      </div>
    </div>
  );
};
