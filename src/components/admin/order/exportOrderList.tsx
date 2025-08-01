import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import { Button, DatePicker, Form, message } from 'antd';
import { useList } from '../../../hooks/useList';
import axios from 'axios';

const ExportOrderList = ({ isOpen, onClose }: any ) => {
    const [showModal, setShowModal ] = useState<"exportPDF" | null>("exportPDF");
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [ loading, setLoading ] = useState();
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onClose();
          setShowModal("exportPDF");
        }
    };
    
    const handleExport = async () => {
        if (!startDate || !endDate) {
            message.error("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc");
            return;
        }

        if (dayjs(endDate).isBefore(dayjs(startDate))) {
            message.error("Ngày kết thúc phải sau ngày bắt đầu");
            return;
        }

        try {
            const from = startDate.format("YYYY-MM-DD");
            const to = endDate.format("YYYY-MM-DD");

            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:3000/api/orders/export`, 
                {
                    params: { from, to },
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                
                
            );
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `orders_${from}_to_${to}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success("Xuất file PDF thành công!");
            onClose();
            
        } catch (error) {
            console.error("Export error:", error);
            message.error("Xuất file thất bại. Vui lòng thử lại.");
        }
    }
    return (
        <AnimatePresence>
            {
                isOpen && (
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
                            initial={{ scale: 0.9, opacity: 0}}
                            animate={{ scale: 1, opacity: 1}}
                            exit={{ scale: 0.9, opacity: 0}}
                            transition={{ duration: 0.25 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[470px] p-6 flex flex-col items-center justify-center"
                            key="modal"
                        >
                            { showModal === "exportPDF" && (
                                <div className='w-full'>
                                    <h2 className="text-[26px] font-bold font-sans mb-8 text-center tracking-tight"> {/* Larger, bolder title with blue color */}
                                        Export invoice to PDF
                                    </h2>

                                    <Form
                                        layout="vertical"
                                        onFinish={handleExport}
                                        className="space-y-6" // Increased spacing between form items
                                    >
                                        <Form.Item
                                            
                                            label={<span className="font-semibold text-gray-700 text-lg">Start Date</span>} 
                                            name="startDate"
                                            rules={[{ required: true, message: 'Please select a start date!' }]}
                                        >
                                            <DatePicker
                                                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-[16px] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 shadow-sm hover:border-blue-400" // Increased padding, text size, stronger focus/hover effects
                                                value={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                format="YYYY-MM-DD"
                                                placeholder="Select date"
                                                style={{height: 40}}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            className='mt-4'
                                            label={<span className="font-semibold text-gray-700 text-[16px]">End Date</span>} 
                                            name="endDate"
                                            rules={[{ required: true, message: 'Please select an end date!' }]}
                                        >
                                            <DatePicker
                                                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 shadow-sm hover:border-blue-400" // Increased padding, text size, stronger focus/hover effects
                                                value={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                format="YYYY-MM-DD"
                                                placeholder="Select date"
                                                style={{height: 40}}
                                            />
                                        </Form.Item>

                                        <div className="flex justify-end gap-4 mt-10"> {/* Increased gap and margin-top */}
                                            <Button
                                                onClick={onClose}
                                                className="px-8 py-3 rounded-xl border border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-200 transition duration-200 font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5" // Bolder, larger, subtle transform on hover
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={loading}
                                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" // Gradient, stronger shadow, subtle transform on hover
                                            >
                                                {loading ? 'Đang xuất...' : 'Xuất PDF'}
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

export default ExportOrderList
