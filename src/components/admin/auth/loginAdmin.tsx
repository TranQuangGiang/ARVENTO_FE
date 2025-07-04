import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLogin } from '../../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { useContext } from 'react';
import { AuthContexts } from '../../contexts/authContexts';

const LoginAdmin = () => {
  const nav = useNavigate();
  const { login } = useContext(AuthContexts);
  
  const { mutate } = useLogin({
    resource: `/auth/login`
  });
  
  function onFinish (values:any) {
    mutate(values, {
      onSuccess: (data:any) => {
        message.success("Đăng nhập thành công");
        login(data);
        window.location.href = '/admin';     
      },
      onError: (err:any) => {
        const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
        message.error(errMessage);
      }
    });
  }
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video nền */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover z-0 brightness-50"
      >
        <source src="/traidat.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Form login */}
      <div className="absolute z-10 w-full h-full flex items-center justify-center px-4">
        <div className="bg-white relative bg-opacity-90 rounded-xl shadow-xl w-full max-w-[550px] p-8">
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
            <img
              src="/iconLogin.png"
              alt="Admin Icon"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-white object-cover"
            />
          </div>
          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"

          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="admin"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
              />
            </Form.Item>

            <Form.Item className="mt-10">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
