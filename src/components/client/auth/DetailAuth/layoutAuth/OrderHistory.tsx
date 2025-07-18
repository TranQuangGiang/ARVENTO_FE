import React, { useState } from 'react'
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Image, Input, message, Modal, Popconfirm, Select } from 'antd';
import { CalendarOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useUpdateUser } from '../../../../../hooks/useUpdate';
import axios from 'axios';

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    const getOrderStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "pending";
            case "confirmed":
                return "confirmed";
            case "processing":
                return "processing";
            case "shipping":
                return "shipping";
            case "delivered":
                return "delivered";
            case "completed":
                return "completed";
            case "cancelled":
                return "cancelled";
            case "returning": 
                return "returning"
            case "returned":
                return "returned";
            default:
                return "Không xác định";
        }
    };

    const getOrderStatusStyle = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "confirmed":
                return "bg-blue-100 text-blue-700";
            case "processing":
                return "bg-cyan-100 text-cyan-700";
            case "shipping":
                return "bg-purple-100 text-purple-700";
            case "delivered":
                return "bg-green-100 text-green-700";
            case "completed":
                return "bg-green-200 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-700";
            case "returning":
                return "bg-orange-100 text-orange-700"
            case "returned":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };
    const orderTabs = [
        { key: "all", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "confirmed", label: "Confirmed" },
        { key: "processing", label: "Processing" },
        { key: "shipping", label: "Shipping" },
        { key: "delivered", label: "Delivered" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
        { key: "returning", label: "Returning" },
        { key: "returned", label: "Returned" },
    ];


    const { data:orderData, refetch } = useList({
        resource: `/orders/my`
    });
    const orders = orderData?.data.orders  || [];
    console.log(orders);
    
    const filteredOrders = selectedStatus === "all"
     ? orders
     : orders.filter((order: any) => order.status === selectedStatus);


    const handleCancelOrder = async (orderId: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            if (status !== "pending" && status !== "confirmed") {
                message.error("Bạn khổng thể hủy đơn hàng đơn hàng đã được xử lý");
                return;
            } 
            await axios.patch(`http://localhost:3000/api/orders/${orderId}/cancel`, 
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            message.success("Huỷ đơn hàng thành công!");
            refetch(); // cập nhật lại danh sách
        } catch (error) {
            console.error(error);
            message.error("Không thể huỷ đơn hàng.");
        }
    };

    const handleConfirmComplete = async (orderId:number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, 
                { status: "completed" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            message.success("Xác nhận đơn hàng thành công, vui lòng đánh giá sản phẩm giúp shop !");
            refetch();
        } catch (error) {
            console.error(error);
            message.error("Không xác nhận hoàn thành đơn hàng.");
        }
        
    }
    // chức năng yêu cầu trả hàng
    const handleRequestReturn = (orderId: string) => {
        let reason = "";

        Modal.confirm({
            width: 600,
            height: 300,
            title: <span style={{ fontSize: '18px', fontWeight: 600, color: '#eab308', textAlign: "center", width: "100%"}}> Yêu cầu trả hàng</span>,
            content: (
                <div style={{ marginTop: 10 }}>
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Vui lòng nhập lý do muốn trả hàng:</p>
                    <Input.TextArea
                        rows={4}
                        maxLength={500}
                        onChange={(e) => { reason = e.target.value; }}
                        placeholder="Nhập lý do trả hàng (tối đa 500 ký tự)"
                        style={{
                            borderRadius: 8,
                            padding: 10,
                            fontSize: 14,
                            resize: 'none'
                        }}
                    />
                </div>
            ),
            okText: <span style={{ fontWeight: 600 }}>Gửi yêu cầu</span>,
            cancelText: "Hủy",
            okButtonProps: {
                style: {
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    fontWeight: 600,
                    borderRadius: 6
                }
            },
            cancelButtonProps: {
                style: {
                    borderRadius: 6
                }
            },
            onOk: async () => {
                try {
                    const token = localStorage.getItem("token");
                    await axios.patch(`http://localhost:3000/api/orders/${orderId}/request-return`, 
                        {
                            is_return_requested: true,
                            note: reason || ""
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    message.success("Đã gửi yêu cầu trả hàng!");
                    refetch();
                } catch (error) {
                    console.error(error);
                    message.error("Gửi yêu cầu thất bại!");
                }
            }
        })
    }
    return (
        <div className='w-full min-h-screen'>
            <div className='w-full h-full rounded-[15px] bg-white min-h-screen'>
                <div className="flex h-16 items-center ">
                    {orderTabs.map((tab) => (
                        <div
                            key={tab.key}
                            onClick={() => setSelectedStatus(tab.key)}
                            className={`pb-2 ml-6 text-center cursor-pointer text-[14px] font-semibold ${
                                selectedStatus === tab.key
                                ? "text-red-600 border-b-[3px] rounded-[1px] border-red-600"
                                : "text-gray-500"
                            }`}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order: any) => (
                            <Card key={order._id} bordered className="shadow-sm">
                                <div className="flex justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-gray-500 text-[12px] mb-1">
                                            SKU: <strong>{order._id}</strong>
                                        </p>
                                        <p className="font-bold text-lg mb-2">Products in order:</p>
                                        {order.items?.map((item: any) => {
                                        const itemTotal = item.quantity * (item.price || 0);
                                            return (
                                                <div key={item.product._id} className="flex items-center gap-3 mb-2">
                                                    <Image
                                                        src={item.selected_variant?.image?.url}
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

                                    <div className="flex flex-col items-end gap-2 max-w-[300px]">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusStyle(order.status)}`}>
                                            {getOrderStatusLabel(order.status)}
                                        </span>
                                        <p className="text-gray-600 text-[15px]">
                                            <CalendarOutlined /> Order date: {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="font-bold text-red-600 text-[17px]">
                                            <DollarOutlined /> Total: {order.total?.toLocaleString()}₫
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-end mt-2">
                                            <Link to={`/detailAuth/detailOrder/${order._id}`}>
                                                <Button type="primary" className='text-[16px]' style={{ height: 38 }}>
                                                Xem chi tiết
                                                </Button>
                                            </Link>

                                            {order.status === "delivered" && (
                                                <Popconfirm
                                                title="Xác nhận bạn đã nhận hàng và muốn hoàn thành đơn hàng?"
                                                okText="Hoàn thành"
                                                cancelText="Hủy"
                                                onConfirm={() => handleConfirmComplete(order._id)}
                                                >
                                                <Button
                                                    type="default"
                                                    style={{ height: 38, color: '#16a34a', borderColor: '#16a34a' }}
                                                    className="text-[16px]"
                                                >
                                                    ✅ Đã nhận hàng
                                                </Button>
                                                </Popconfirm>
                                            )}
                                            {order.status === "delivered" && (
                                                <Button
                                                    type="default"
                                                    style={{ height: 38, color: '#d97706', borderColor: '#d97706' }}
                                                    className="text-[16px]"
                                                    onClick={() => handleRequestReturn(order._id)}
                                                >
                                                    ↩️ Yêu cầu trả hàng
                                                </Button>
                                            
                                            )}
                                            {
                                                (order.status === 'pending' || order.status === "confirmed") && (
                                                    <Popconfirm
                                                        title="Bạn chắc chắn muốn huỷ đơn hàng này?"
                                                        okText="Huỷ"
                                                        cancelText="Không"
                                                        onConfirm={() => handleCancelOrder(order._id, order.status)} // truyền status vào
                                                    >
                                                        <Button
                                                            danger
                                                            type="default"
                                                            icon={<ExclamationCircleOutlined />}
                                                            style={{ height: 38 }}
                                                            className="text-[16px]"
                                                        >
                                                            Huỷ đơn
                                                        </Button>
                                                    </Popconfirm>
                                                )
                                            }
                                        </div>  
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