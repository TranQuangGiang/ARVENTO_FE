import { Button, Form, Input } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useUserMe } from '../../../../../hooks/useOne';
import { useUpdateUser } from '../../../../../hooks/useUpdate';
import { X } from 'lucide-react';

const UpdateAccount = ({ isOpen, onClose }: any) => {
    const [showModal, setShowModal] = useState<"updateAccount" | null>("updateAccount");
    const [form] = Form.useForm();
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
            setShowModal("updateAccount");
        }
    };

    const token = localStorage.getItem("token");
    const { data:user, refetch } = useUserMe({
        resource: `/users/me`,
        token: token,
    })
    useEffect(() => {
        if (!user?.data) return;

        const { name, email, address } = user.data;

        form.setFieldsValue({
            name,
            email,
            phone: address?.[0]?.phone || '',
        });
    }, [user]);

    const { mutate } = useUpdateUser({
        resource: `users/me`
    })
    const onFinish = async (values: any) => {
        if (!user) return;
        // Gửi lên chỉ name, giữ nguyên email, phone cũ
        mutate({
            ...user.data,
            name: values.name,
        }, {
            onSuccess: () => {
                onClose();
                refetch();
            }
        });
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleOverlayClick}
                    key="overlay"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[470px] p-6 relative"
                        key="modal"
                    >   
                        <button
                            onClick={onClose}
                            className="absolute px-1.5 py-1.5 z-20 top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:rounded-[50%] flex items-center justify-center transition-all duration-300"
                        >
                            <X />
                        </button>
                        {showModal === "updateAccount" && (
                            <>
                                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Cập nhật tài khoản</h2>
                                <Form
                                    layout="vertical"
                                    className="space-y-7"
                                    form={form}
                                    onFinish={onFinish}
                                >
                                <Form.Item className='[&_Input]:h-[40px]' label="Họ tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                                    <Input
                                        type="text"
                                        placeholder="Nhập họ tên mới"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </Form.Item>

                                <Form.Item label="Email" className='[&_Input]:h-[40px]'  name="email">
                                    <Input
                                        type="text"
                                        readOnly
                                        placeholder="email@example.com"
                                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                                    />
                                </Form.Item>

                                <Form.Item label="Số điện thoại" className='[&_Input]:h-[40px]'  name="phone">
                                    <Input
                                        type="text"
                                        readOnly
                                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <Button
                                            htmlType='reset'
                                            onClick={onClose}
                                            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                        >
                                            Hủy
                                        </Button>
                                        <Button
                                            type='primary'
                                            htmlType="submit"
                                            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                        >
                                            Lưu
                                        </Button>
                                    </div>
                                </Form.Item>
                                </Form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateAccount;
