import React from 'react';
import { Link } from 'react-router-dom';
import { useList } from '../../../../../hooks/useList';
import { Tag, Spin, Empty, Typography } from 'antd';
import { GiftOutlined, ClockCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DiscountCode = () => {
    const token = localStorage.getItem("token");

    const { data, isLoading } = useList({
        resource: `/coupons/available`,
        token: token
    });

    // Loading State
   

    // No Discount UI - Redesigned
    const NoDiscountUI = (
        <div className='w-full relative h-60 rounded-[15px] bg-white flex flex-col items-center justify-center p-5'>
            <div className='absolute top-4 left-5 right-5 flex justify-between items-center'>
                <Title level={4} className='!m-0 text-gray-800'>Khuyến mãi của bạn</Title>
                <Link to={`/used-vouchers`}>
                    <Text className='font-semibold text-blue-500 hover:text-blue-700 transition-colors'>Phiếu giảm giá đã sử dụng</Text>
                </Link>
            </div>
            <Empty
                image={<GiftOutlined className="text-6xl text-gray-400" />}
                description={
                    <span className="text-gray-500 mt-2">
                        Bạn không có phiếu giảm giá nào khả dụng.
                    </span>
                }
            />
        </div>
    );

    // Discount List UI - Redesigned for modern look
    const DiscountListUI = (
        <div className='w-full relative rounded-[15px] bg-white p-6 shadow-md'>
            <div className='flex justify-between items-center mb-6'>
                <Title level={4} className='!m-0 text-gray-800'>Your Vouchers</Title>
                <Link to={`/used-vouchers`}>
                    <Text className='font-semibold text-blue-500 hover:text-blue-700 transition-colors'>Used Vouchers</Text>
                </Link>
            </div>
            
            <div className='space-y-4'>
                {data?.data.map((coupon:any) => (
                    <div
                        key={coupon._id}
                        className="relative flex bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm
                                   transition-transform transform hover:scale-[1.01] hover:shadow-lg duration-300"
                    >
                        {/* Left Section - Vertical highlight */}
                        <div className="w-2 bg-gradient-to-b from-blue-500 to-blue-700" />
    
                        {/* Center Section - Coupon Details */}
                        <div className="flex-1 px-5 py-4 flex flex-col justify-center">
                            <Tag color="blue" className="w-fit mb-1 font-semibold">
                                DISCOUNT CODE
                            </Tag>
                            <h2 className="text-[18px] font-extrabold text-gray-800">{coupon.code}</h2>
                            <p className="text-sm text-gray-600 mt-1">{coupon.description || "No description provided"}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-3">
                              <ClockCircleOutlined className="mr-1 text-red-500" />
                              Ngày hết hạn: <span className="text-red-500 font-semibold ml-1">{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                            </div>
                        </div>
    
                        {/* Right Section - Discount Value */}
                        <div className="relative w-[150px] flex flex-col items-center justify-center bg-gray-50 border-l border-dashed border-gray-300">
                            <div className="text-center p-4">
                                <span className="text-base font-medium text-gray-500">Lên đến</span>
                                <span className="block text-xl font-bold text-red-500 mt-1">
                                    {coupon.discountType === "percentage"
                                        ? `-${coupon.discountValue}%`
                                        : `-${coupon.discountValue.toLocaleString()}₫`}
                                </span>
                            </div>
    
                            {/* Dotted dividers */}
                            <div className="absolute top-0 left-[-8px] h-full flex flex-col justify-around">
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-dashed border-gray-300" />
                                <div className="w-4 h-4 rounded-full bg-white border-2 border-dashed border-gray-300" />
                            </div>
                        </div>
    
                        {/* Apply Button */}
                        <button
                            className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-700 flex items-center font-semibold text-sm transition-colors"
                            onClick={() => console.log(`Applying coupon ${coupon.code}`)}
                        >
                            <span className="mr-1">APPLY</span>
                            <RightCircleOutlined />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    if (!data?.data || data.data.length === 0) {
        return NoDiscountUI;
    }
    
    return DiscountListUI;
};

export default DiscountCode;