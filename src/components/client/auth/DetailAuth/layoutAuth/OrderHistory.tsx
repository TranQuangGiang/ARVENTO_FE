import React, { useState } from 'react'

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    const orderTabs = [
        { key: "all", label: "Tất cả" },
        { key: "pending", label: "Chờ xác nhận" },
        { key: "confirmed", label: "Đã xác nhận" },
        { key: "shipping", label: "Đang vận chuyển" },
        { key: "delivered", label: "Đã giao hàng" },
        { key: "cancelled", label: "Đã huỷ" },
    ];

    return (
        <div className='w-full min-h-screen'>
            <div className='w-full h-full rounded-[15px] bg-white min-h-screen'>
                <div className="flex h-16 items-center ">
                    {orderTabs.map((tab) => (
                        <div
                            key={tab.key}
                            onClick={() => setSelectedStatus(tab.key)}
                            className={`pb-2 ml-6 text-center px-4 cursor-pointer text-[15px] font-semibold font-sans ${
                                selectedStatus === tab.key ? "text-red-600 border-b-[3px] rounded-[1px] font-semibold font-sans border-red-600" : "text-gray-500"
                            }`}
                        >
                        {tab.label}
                        </div>
                    ))}
                </div>
                <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                    <div className="absolute w-[300px] h-[140px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                        {/* Nội dung ở phía trên */}
                    <span className="relative z-10 w-full flex flex-col items-center">
                        <img className="w-[170px]" src="/cartD.png" alt="" />
                    </span>
                    <p className='mt-4 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có đơn hàng nào ? </p>
                </div>
            </div>
        </div>
    )
}

export default OrderHistory