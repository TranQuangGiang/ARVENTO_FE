import { Button, Form, Input, message } from "antd";
import { motion, AnimatePresence } from 'framer-motion';

import { useRegister } from "../../../hooks/useRegister";
import { X } from "lucide-react";

const Register = ({ isOpen, onClose, switchToLogin }: any) => {
  if (!switchToLogin) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { mutate } = useRegister({
    resource: "/auth/register",
  });

  function onFinish(values: any) {
    mutate(values, {
      onSuccess: () => {
        message.success(`Đăng ký thành công`);
        switchToLogin();
      },
      onError: (err: any) => {
        const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra ";
        message.error(errMessage);
      },
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
          key="overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex relative flex-col lg:flex-row max-w-5xl min-h-[507px] mx-auto rounded-2xl shadow-lg overflow-hidden bg-white"
            key="modal"
          > 
            <button
              onClick={onClose}
              className="absolute px-1.5 py-1.5 z-20 top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:rounded-[50%] flex items-center justify-center transition-all duration-300"
            >
              <X />
            </button>
            <div className="w-[50%] text-white lg:w-1/2 p-8 flex flex-col justify-center pt-[0px]">
              <h2 className="text-3xl font-bold mb-4 text-[#01225a]">Chào mừng đến với ARVENTO</h2>
              <p className="mb-6 text-[16px] text-[#01225a]">
                Tạo tài khoản để tận hưởng mua sắm 
                liền mạch và nhiều ưu đãi hấp dẫn!
              </p>
              <img
                src="/images/bangiay1.png"
                alt="Shoe"
                className="w-[800px] mx-auto"
              />
            </div>

            <div className="lg:w-1/2 p-8 bg-white">
              <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
                Tạo tài khoản của bạn
              </h3>
              <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Họ tên"
                  name="name"
                  rules={[{ required: true, min: 2, max: 50 }]}
                  className="block text-gray-700 font-medium mb-1"
                >
                  <Input
                    placeholder="John Doe"
                    className="w-full px-4 h-[40px] border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, type: "email" }]}
                  className="block text-gray-700 font-medium mb-1"
                >
                  <Input
                    placeholder="you@example.com"
                    className="w-full px-4 h-[40px] border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  hasFeedback
                  rules={[{ required: true, min: 6 }]}
                  className="block text-gray-700 font-medium mb-1"
                >
                  <Input.Password
                    placeholder="password"
                    className="w-full px-4 h-[40px] border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                  />
                </Form.Item>

                <Button
                  style={{ height: 45 }}
                  type="primary"
                  htmlType="submit"
                  className="w-full mt-[15px] !text-white rounded-[4px] font-semibold hover:bg-blue-800 cursor-pointer transition-all duration-200"
                >
                  Đăng ký
                </Button>
              </Form>

              <p className="text-sm text-center mt-[25px] text-gray-600">
                Bạn đã có tài khoản ?{" "}
                <button
                  onClick={switchToLogin}
                  className="text-blue-700 hover:underline cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Register;
