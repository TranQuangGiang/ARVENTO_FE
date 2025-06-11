import { useState } from "react";
import { Form, Input, Button } from "antd";
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from "lucide-react";
import { useForgotPassword } from "../../../hooks/useForgotPassword";

const ForgotPassword = ({ onClose }: { onClose?: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { mutate } = useForgotPassword({
        resource: "/auth/forgot-password",
        onSuccess: () => {
            setIsSuccess(true);
        },
        onError: () => setLoading(false),
    })

    const onFinish = (values:any) => {
        mutate(values);
        setLoading(true);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
                className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 transition-all duration-300"
            >
                <motion.div
                    initial={{scale: 0.9, opacity: 0}}
                    animate={{scale:1, opacity: 1}}
                    exit={{scale: 0.9, opacity: 0}}
                    transition={{duration: 0.3}}
                    className="flex flex-col lg:flex-row w-2xl mx-auto rounded-2xl shadow-lg overflow-hidden bg-white"
                    key="modal"
                >
                    <div className="p-6 w-full">
                        {
                            !isSuccess ? (
                                <>
                                    <h2 className="text-xl font-bold font-sans mb-4 text-center">Forgot Password</h2>
                                    <Form onFinish={onFinish} layout="vertical">
                                        <Form.Item
                                            label="Email address"
                                            name="email"
                                            rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}
                                        >
                                            <Input className="w-[300px] relative pl-24 h-[45px]" placeholder="you@example.com" prefix={<Mail className="mr-1.5 text-gray-500" style={{width: 20}} />}/>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button loading={loading} type="primary" className="mt-2.5" style={{height: 40}} htmlType="submit" block>
                                                Send an email
                                            </Button>
                                        </Form.Item>
                                        <span className="w-full text-center">
                                            <p
                                                onClick={onClose}
                                                className="w-[150px] mx-auto cursor-pointer text-blue-600 hover:underline"
                                            >
                                                Quay lại đăng nhập
                                            </p>
                                        </span>
                                        
                                    </Form>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <h2 className="text-xl font-bold mb-4">Email đã được gửi!</h2>
                                    <p>Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.</p>
                                    <Button
                                        type="primary"
                                        style={{marginTop: 20, height: 40}}
                                        onClick={onClose}
                                    >
                                        Quay lại đăng nhập
                                    </Button>
                                </div>
                            )
                        }
                        
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
        
    );
};

export default ForgotPassword;
