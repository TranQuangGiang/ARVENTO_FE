import React, { useState } from 'react';
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Image, Input, message, Modal, Popconfirm, Select } from 'antd';
import { CalendarOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");

    const getOrderStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "confirmed":
                return "Confirmed";
            case "processing":
                return "Processing";
            case "shipping":
                return "Shipping";
            case "delivered":
                return "Delivered";
            case "completed":
                return "Completed";
            case "cancelled":
                return "Cancelled";
            case "returning":
                return "Returning";
            case "returned":
                return "Returned";
            default:
                return "Unknown";
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
                return "bg-orange-100 text-orange-700";
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


    const { data: orderData, refetch } = useList({
        resource: `/orders/my`
    });
    const orders = orderData?.data.orders || [];
    console.log(orders);

    const filteredOrders = selectedStatus === "all"
        ? orders
        : orders.filter((order: any) => order.status === selectedStatus);

    const handleCancelOrder = (orderId: string, status: string) => {
        if (status !== "pending") {
            message.error("You cannot cancel an order that has already been processed.");
            return;
        }

        const predefinedReasons = [
            "I ordered the wrong shoe size",
            "I want to switch to a different shoe model",
            "Delivery time is too long",
            "I found a cheaper price elsewhere",
            "I no longer need to buy shoes",
            "Other"
        ];

        // Using useRef-like to store values persistently
        const reasonRef = { current: "Other" };
        const customRef = { current: "" };

        const ModalContent = () => {
            const [reason, setReason] = useState("Other");
            const [custom, setCustom] = useState("");

            // Update the ref
            reasonRef.current = reason;
            customRef.current = custom;

            return (
                <div style={{ marginTop: 10 }}>
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Please select a reason for canceling the order:</p>

                    <Select
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Select a reason"
                        value={reason}
                        onChange={(value) => setReason(value)}
                        options={predefinedReasons.map(item => ({
                            label: item,
                            value: item
                        }))}
                    />

                    {reason === "Other" && (
                        <Input.TextArea
                            rows={4}
                            maxLength={300}
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="Enter the reason for canceling the order (max 300 characters)"
                            style={{
                                borderRadius: 8,
                                padding: 10,
                                fontSize: 14,
                                resize: 'none'
                            }}
                        />
                    )}
                </div>
            );
        };

        Modal.confirm({
            width: 600,
            title: <span style={{ fontSize: '18px', fontWeight: 600, color: '#ef4444' }}>Confirm Order Cancellation</span>,
            content: <ModalContent />,
            okText: "Confirm Cancellation",
            cancelText: "No",
            onOk: async () => {
                const reasonToSend =
                    reasonRef.current !== "Other"
                        ? reasonRef.current
                        : (customRef.current || "").trim();

                if (!reasonToSend) {
                    message.error("Please select or enter a reason for cancellation.");
                    return Promise.reject();
                }

                try {
                    const token = localStorage.getItem("token");
                    await axios.patch(
                        `http://localhost:3000/api/orders/${orderId}/cancel`,
                        {
                            note: reasonToSend
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    message.success("Order cancelled successfully!");
                    refetch();
                } catch (error) {
                    console.error(error);
                    message.error("Could not cancel order.");
                }
            }
        });
    };



    const handleConfirmComplete = async (orderId: number) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`,
                {
                    status: "completed",
                    note: "Status updated successfully completed"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            message.success("Order confirmed as complete, please rate the product to help us!");
            refetch();
        } catch (error) {
            console.error(error);
            message.error("Could not confirm order completion.");
        }

    }
    // Return request function
    const handleRequestReturn = (orderId: string) => {
        let reasonRef  = { current: ""};
        Modal.confirm({
            width: 600,
            height: 300,
            title: <span style={{ fontSize: '18px', fontWeight: 600, color: '#eab308', textAlign: "center", width: "100%" }}> Return Request</span>,
            content: (
                <div style={{ marginTop: 10 }}>
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Please enter the reason for the return:</p>
                    <Input.TextArea
                        rows={4}
                        maxLength={500}
                        onChange={(e) => { reasonRef.current = e.target.value; }}
                        placeholder="Enter the reason for return (max 500 characters)"
                        style={{
                            borderRadius: 8,
                            padding: 10,
                            fontSize: 14,
                            resize: 'none'
                        }}
                    />
                </div>
            ),
            okText: <span style={{ fontWeight: 600 }}>Send Request</span>,
            cancelText: "Cancel",
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
                const trimmedReason = (reasonRef.current || "").trim();
                if (!trimmedReason) {
                    message.error("Please enter a reason before sending the return request.");
                    return Promise.reject(); // Ngăn modal tự đóng
                }
                try {
                    const token = localStorage.getItem("token");
                    await axios.patch(`http://localhost:3000/api/orders/${orderId}/request-return`,
                        {
                            is_return_requested: true,
                            note: trimmedReason || ""
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    message.success("Return request sent!");
                    refetch();
                } catch (error) {
                    console.error(error);
                    message.error("Failed to send request!");
                }
            }
        })
    }
    return (
        <div className='w-full min-h-screen'>
            <div className='w-full h-full rounded-[15px] bg-white min-h-screen mb-4'>
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
                            <Card key={order._id} bordered className="shadow-md rounded-xl transition-all duration-200 hover:shadow-lg">
                                {order.status === "delivered" && order.is_return_requested && (
                                    <div className="w-full bg-yellow-50 border mt-0 border-yellow-300 text-yellow-800 px-4 py-1.5 rounded mb-3 flex items-center gap-2">
                                        <span className="text-[17px]">⚠️</span>
                                        <span className="font-medium text-[14px]">
                                            Your return request is being processed. Please wait for the shop's response!
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-gray-500 text-[12px] mb-1">
                                            SKU: <strong>{order._id}</strong>
                                        </p>
                                        <p className="font-bold text-lg mb-2">Products in order:</p>
                                        {order.items?.map((item: any) => {
                                            return (
                                                <div key={item.product?._id} className="flex items-center gap-3 mb-2">
                                                    <Image
                                                        src={item.selected_variant?.image?.url}
                                                        width={70}
                                                        height={70}
                                                        preview={false}
                                                        className="rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-base">
                                                            {item.product?.name} - x{item.quantity} -
                                                            <span className="text-red-600 font-semibold ml-1">
                                                                {item.total_price?.toLocaleString()}₫
                                                            </span>
                                                        </p>
                                                        <p className="text-gray-600 text-sm">
                                                            Unit price: {item.unit_price?.toLocaleString()}₫
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
                                                    View order details
                                                </Button>
                                            </Link>

                                            {order.status === "delivered" && !order.is_return_requested && (
                                                <Popconfirm
                                                    title="Confirm that you have received the goods and want to complete the order?"
                                                    okText="Complete"
                                                    cancelText="Cancel"
                                                    onConfirm={() => handleConfirmComplete(order._id)}
                                                >
                                                    <Button
                                                        type="default"
                                                        style={{ height: 38, color: '#16a34a', borderColor: '#16a34a' }}
                                                        className="text-[16px]"
                                                    >
                                                        ✅ Received
                                                    </Button>
                                                </Popconfirm>
                                            )}
                                            {order.status === "delivered" && !order.is_return_requested && (
                                                <Button
                                                    type="default"
                                                    style={{ height: 38, color: '#d97706', borderColor: '#d97706' }}
                                                    className="text-[16px]"
                                                    onClick={() => handleRequestReturn(order._id)}
                                                >
                                                    ↩️ Request Return
                                                </Button>

                                            )}
                                            {
                                                (order.status === 'pending') && (
                                                    <Popconfirm
                                                        title="Are you sure you want to cancel this order?"
                                                        okText="Cancel"
                                                        cancelText="No"
                                                        onConfirm={() => handleCancelOrder(order._id, order.status)}
                                                    >
                                                        <Button
                                                            danger
                                                            type="default"
                                                            icon={<ExclamationCircleOutlined />}
                                                            style={{ height: 38 }}
                                                            className="text-[16px]"
                                                        >
                                                            Cancel Order
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
                            <p className="mt-4 text-[13px] font-medium font-sans text-blue-950">You don't have any orders yet.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default OrderHistory;