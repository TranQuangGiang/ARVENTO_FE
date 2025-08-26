import { Button, Form, Input, message } from "antd";
import React, { useContext, useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useLogin } from "../../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContexts } from "../../contexts/authContexts";
import ForgotPassword from "./ForgotPassword";
import { X } from "lucide-react";
import ScrollToTop from "../../ScrollToTop";


const Login = ({ isOpen, onClose, switchToRegister }: any) => {
  const [showModal, setShowModal] = useState<"login" | "forgotPassword" | null>("login");
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setShowModal("login")
    }
  };

  const nav = useNavigate(); 
  const { login } = useContext(AuthContexts);
  
  const { mutate } = useLogin({
    resource: "/auth/login"
  });
  function onFinish(values:any) {
    mutate(values, {
      onSuccess: (data:any) => {
        message.success("Đăng nhập thành công");
        login(data);
        onClose();
        window.scrollTo(0, 0);
        nav('/');
      },
      onError: (err:any) => {
        const errMessage = err?.response?.data?.message || "Đã có lỗi xảy ra";
        message.error(errMessage);
      }
    })
  }
  return (
    <AnimatePresence>
      {
        isOpen && (
          <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center z-50 transition-all duration-300"
            onClick={handleOverlayClick}
            key="overlay"
          >
            <motion.div
              initial={{scale: 0.9, opacity: 0}}
              animate={{scale:1, opacity: 1}}
              exit={{scale: 0.9, opacity: 0}}
              transition={{duration: 0.3}}
              className="flex relative flex-col lg:flex-row max-w-5xl mx-auto rounded-2xl shadow-lg overflow-hidden bg-white"
              key="modal"
            >
              <button
                onClick={onClose}
                className="absolute px-1.5 py-1.5 z-20 top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:rounded-[50%] flex items-center justify-center transition-all duration-300"
              >
                <X />
              </button>
              {
                showModal === "login" && (
                  <>
                    <div className="w-[50%] p-8 flex flex-col pt-[90px]">
                      <h2 className="text-3xl font-bold mb-4 text-[#01225a]">Chào mừng trở lại!</h2>
                      <p className="mb-6 text-[16px] text-[#01225a]">
                        Đăng nhập để tiếp tục mua sắm và tận hưởng những lợi ích độc quyền.
                      </p>
                      <img
                        src="/images/bangiay1.png"
                        alt="Shoe"
                        className="w-[900px] mt-[10px] mx-auto hover:scale-[1.1] transition-all duration-300"
                      />
                    </div>
                    {/* Right */}
                    <div className="lg:w-1/2 p-8 bg-white">
                      <h3 className="text-2xl font-semibold text-[#01225a] mb-6 text-center">
                        Đăng nhập vào tài khoản của bạn
                      </h3>
                      <Form onFinish={onFinish} layout="vertical">
                        <Form.Item 
                          label="Email" 
                          rules={[{required: true, type: "email"}]} 
                          className="block text-gray-700 font-medium mb-1"
                          name="email"
                        >
                          <Input
                            placeholder="you@example.com"
                            className="w-full px-4 h-[40px] border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Mật khẩu"
                          rules={[{min: 6, required: true}]}
                          hasFeedback 
                          className="block text-gray-700 font-medium mb-0"
                          name="password"
                        >
                          <Input.Password
                            placeholder="password"
                            className="w-full h-[40px] border border-gray-300 rounded-[4px] focus:outline-1 focus:border-blue-700 outline-none text-[15px]"
                          />
                        </Form.Item>
                        <Button
                          style={{height: 45}}
                          type="primary"
                          htmlType="submit"
                          className="w-full mt-[15px] bg-[#01225a] !text-white z-20 text-[15px] py-2.5 rounded-[4px] font-semibold hover:bg-blue-900 cursor-pointer transition mb-2.5"
                        >
                          Đăng nhập
                        </Button>
                        <span className="w-full text-center">
                          <p
                            onClick={() => setShowModal("forgotPassword")}
                            className="cursor-pointer text-blue-600 hover:underline"
                          >
                            Quên mật khẩu ?
                          </p>
                        </span>
                      </Form>
                      <div className="my-7 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Hoặc tiếp tục với</span>
                      </div>

                      <div className="flex justify-center gap-4 [&_button]:cursor-pointer [&_button]:text-shadow-amber-50 [&_button]:text-white">
                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                          <FaGoogle />
                          Google
                        </button>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                          <FaFacebookF />
                          Facebook
                        </button>
                      </div>

                      <p className="text-sm text-center mt-6 text-gray-600">
                        Bạn không có tài khoản?{" "}
                        <button 
                          onClick={switchToRegister}
                          className="text-blue-700 hover:underline cursor-pointer"
                        >
                          Đăng ký ngay
                        </button>
                      </p>
                    </div>
                  </>
                )
              }
              {
                showModal  === 'forgotPassword' && (
                  <ForgotPassword onClose={() => setShowModal("login")} />
                )
              }
              
          </motion.div>
        </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default Login;
