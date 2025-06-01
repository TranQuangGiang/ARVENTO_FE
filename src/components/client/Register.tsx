import { Button, Form, Input, message } from "antd";
import { motion, AnimatePresence } from 'framer-motion';

import { useRegister } from "../../hooks/useRegister";

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
        message.success(`Đăng ký tài khoản thành công`);
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
            className="flex flex-col lg:flex-row max-w-5xl min-h-[507px] mx-auto rounded-2xl shadow-lg overflow-hidden bg-white"
            key="modal"
          >
            <div className="w-[50%] text-white lg:w-1/2 p-8 flex flex-col justify-center pt-[0px]">
              <h2 className="text-3xl font-bold mb-4 text-[#01225a]">Welcome to NIKA</h2>
              <p className="mb-6 text-[16px] text-[#01225a]">
                Create an account to enjoy seamless shopping and exciting offers!
              </p>
              <img
                src="/images/bangiay1.png"
                alt="Shoe"
                className="w-[800px] mx-auto"
              />
            </div>

            <div className="lg:w-1/2 p-8 bg-white">
              <h3 className="text-2xl font-semibold text-blue-900 mb-6 text-center">
                Create Your Account
              </h3>
              <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                  label="Full Name"
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
                  label="Password"
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
                  Register
                </Button>
              </Form>

              <p className="text-sm text-center mt-[25px] text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={switchToLogin}
                  className="text-blue-700 hover:underline cursor-pointer"
                >
                  Log in here
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
