import React, { useState } from 'react'
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Image, Select } from 'antd';
import { CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

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


    const { data:order } = useList({
        resource: `/orders/my`
    })
    const orders = order?.data;
    console.log(orders);
    

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
                <div className="flex flex-col gap-4">
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order: any) => (
                            <Card key={order._id} bordered className="shadow-sm">
                                <div className="flex justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-gray-500 mb-1">
                                            Order ID: <strong>{order._id}</strong>
                                        </p>
                                        <p className="font-bold text-lg mb-2">Products in order:</p>
                                        {order.items?.map((item: any) => {
                                        const itemTotal = item.quantity * item.price;
                                        return (
                                            <div key={item.product._id} className="flex items-center gap-3 mb-2">
                                            <Image
                                                src={item.product.images[0]?.url}
                                                width={70}
                                                height={70}
                                                preview={false}
                                                className="rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-base">
                                                {item.product.name} - x{item.quantity} - 
                                                <span className="text-red-600 font-semibold ml-1">
                                                    {itemTotal.toLocaleString()}₫
                                                </span>
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                Unit price: {item.price?.toLocaleString()}₫
                                                </p>
                                            </div>
                                            </div>
                                        );
                                        })}
                                    </div>

                                    <div className="flex flex-col items-end gap-2 min-w-[220px]">
                                        <Select
                                            value={order.status}
                                            style={{
                                                width: 180,
                                                fontWeight: 600,
                                            }}
                                        />
                                        <p className="text-gray-600 text-base">
                                            <CalendarOutlined /> Order date: {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="font-bold text-red-600 text-lg">
                                            <DollarOutlined /> Total: {order.total?.toLocaleString()}₫
                                        </p>
                                        <Link to={`/admin/orderDetail/${order._id}`}>
                                            <Button type="primary" size="large">View order details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                            <div className="absolute w-[300px] h-[140px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                            <span className="relative z-10 w-full flex flex-col items-center">
                                <img className="w-[170px]" src="/cartD.png" alt="" />
                            </span>
                            <p className="mt-4 text-[13px] font-medium font-sans text-blue-950">Bạn chưa có đơn hàng nào ?</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default OrderHistory