import { useState } from 'react';
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Image, Input, message, Modal, Popconfirm, Select, Typography } from 'antd';
import { CalendarOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Review from '../../../review';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../../utils/axiosInstance';
import OrderReviewPage from '../../../orderReviewPage';

const { Text, Title } = Typography;

const getOrderStatusLabel = (status: string) => {
    switch (status) {
        case "pending":
            return "Chờ xác nhận";
        case "confirmed":
            return "Đã xác nhận";
        case "processing":
            return "Đang xử lý";
        case "shipping":
            return "Đang giao hàng";
        case "delivered":
            return "Đã giao hàng";
        case "completed":
            return "Hoàn thành";
        case "cancelled":
            return "Đã hủy";
        case "returning": 
            return "Đang trả hàng"
        case "returned":
            return "Đã trả hàng";
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
            return "bg-orange-100 text-orange-700";
        case "returned":
            return "bg-red-200 text-red-800";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

const orderTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipping", label: "Đang giao hàng" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "returning", label: "Đang trả hàng" },
    { key: "returned", label: "Đã trả hàng" },
];

const OrderHistory = () => {
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [isUpdateReviewModalVisible, setUpdateIsReviewModalVisible] = useState(false);
    const [reviewOrderId, setReviewOrderId] = useState<any>(null);
    const [updateReviewOrderId, setUpdateReviewOrderId] = useState<any>(null);
    
    
    const token = localStorage.getItem("token");
    
    const { data: orderData, refetch: refetchOrders } = useList({
        resource: `/orders/my`,
        token: token
    });
    const orders = orderData?.data.orders || [];
    
    const filteredOrders = selectedStatus === "all"
        ? orders
        : orders.filter((order: any) => order.status === selectedStatus);
    

    // call api review
    const { data:reviewData, refetch: refetchReviews } = useQuery({
        queryKey: ['reviews'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axiosInstance.get('/reviews/my-reviews', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const reviews = res?.data.data;
                return reviews
            } catch (error) {
                console.log("Lỗi khi tải đánh giá của chính người dùng !", error);
            }
            
        }
    })

    // mở review
    const handleOpenReviewModal = (orderId: string) => {
        setReviewOrderId(orderId);
        setIsReviewModalVisible(true);
    };

    const handleCloseReviewModal = async () => {
        setIsReviewModalVisible(false);
        setReviewOrderId(null);
        await refetchReviews();
        await refetchOrders();
    };

    // update review
    const handleOpenUpdateReviewModal = (orderId: string) => {
        setUpdateReviewOrderId(orderId);
        setUpdateIsReviewModalVisible(true);
    }

    const handleCloseUpdateReviewModal = async () => {
        setUpdateIsReviewModalVisible(false);
        setUpdateReviewOrderId(null);
        await refetchReviews();
        await refetchOrders();
    };

       
        
    const handleCancelOrder = (orderId: string, status: string) => {
        if (status !== "pending") {
            message.error("Bạn không thể hủy đơn hàng đã được xử lý.");
            return;
        }

        const predefinedReasons = [
            "Tôi đã đặt nhầm cỡ giày",
            "Tôi muốn đổi sang mẫu giày khác",
            "Thời gian giao hàng quá lâu",
            "Tôi tìm thấy giá rẻ hơn ở nơi khác",
            "Tôi không cần mua giày nữa",
            "Khác"
        ];

        // Using useRef-like to store values persistently
        const reasonRef = { current: "Khác" };
        const customRef = { current: "" };

        const ModalContent = () => {
            const [reason, setReason] = useState("Khác");
            const [custom, setCustom] = useState("");

            // Update the ref
            reasonRef.current = reason;
            customRef.current = custom;

            return (
                <div style={{ marginTop: 10 }}>
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Vui lòng chọn lý do hủy đơn:</p>

                    <Select
                        style={{ width: '100%', marginBottom: 10 }}
                        placeholder="Vui lòng chọn lý do hủy đơn"
                        value={reason}
                        onChange={(value) => setReason(value)}
                        options={predefinedReasons.map(item => ({
                            label: item,
                            value: item
                        }))}
                    />

                    {reason === "Khác" && (
                        <Input.TextArea
                            rows={4}
                            maxLength={300}
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="Nhập lý do hủy đơn hàng (tối đa 300 ký tự)"
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
            title: 
                <div className='w-full text-center'>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#ef4444'}}>Xác nhận hủy đơn hàng</span>
                </div>
            ,
            content: <ModalContent />,
            icon: null,
            okText: "Xác nhận hủy",
            cancelText: "Không",
            onOk: async () => {
                const reasonToSend =
                    reasonRef.current !== "Other"
                        ? reasonRef.current
                        : (customRef.current || "").trim();

                if (!reasonToSend) {
                    message.error("Vui lòng chọn hoặc nhập lý do hủy.");
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
                    message.success("Hủy đơn hàng thành công!");
                    refetchOrders();
                } catch (error) {
                    console.error(error);
                    message.error("Hủy đơn hàng thất bại ");
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
                    note: "Cập nhập thành công trạng thái hoàn thành"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            message.success("Đơn hàng đã được xác nhận hoàn tất, vui lòng đánh giá sản phẩm để giúp chúng tôi!");
            refetchOrders();
        } catch (error) {
            console.error(error);
            message.error("Không thể xác nhận hoàn tất đơn hàng.");
        }

    }
    // Return request function
    const handleRequestReturn = async (orderId: string) => {
        
        const token = localStorage.getItem("token")
        const { data } = await axios.get(`http://localhost:3000/api/orders/${orderId}`, {
            headers : {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(data);
      
        const orderDetails = data.data;
        let reasonRef  = { current: ""};
        Modal.confirm({
            width: 600,
            height: 300,
            icon: null,
            title: 
                <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#eab308' }}>
                        Yêu cầu hoàn hàng hoặc hoàn tiền
                    </span>
                </div>
            ,
            content: (
                <div style={{ marginTop: 10 }}>
                    {orderDetails.items?.map((item: any) => (
                        <Card
                            key={item.product._id}
                            style={{ marginBottom: 15, borderRadius: 10, border: '1px solid #f0f0f0' }}
                            bodyStyle={{ padding: 12 }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Image
                                    width={80}
                                    height={80}
                                    src={item.selected_variant?.image?.url}
                                    style={{ borderRadius: 8, objectFit: 'cover' }}
                                    preview={false}
                                />
                                <div style={{ flex: 1 }}>
                                    <Title level={5} style={{ margin: 0, fontWeight: 700 }}>{item.product.name}</Title>
                                    <div style={{ display: 'flex', gap: 15 }}>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Size: <Text strong>{item.selected_variant?.size}</Text></Text>
                                        <Text type="secondary" style={{ fontSize: 13 }}>Số lượng: <Text strong>{item.quantity}</Text></Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {/* Thêm Checkbox vào đây */}
                   
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Bạn gặp vấn đề gì với mặt hàng của mình ?</p>
                    <Input.TextArea
                        rows={4}
                        maxLength={500}
                        onChange={(e) => { reasonRef.current = e.target.value; }}
                        placeholder="Nhập lý do trả lại (tối đa 500 ký tự)"
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
                const trimmedReason = (reasonRef.current || "").trim();
                if (!trimmedReason) {
                    message.error("Vui lòng nhập lý do trước khi gửi yêu cầu trả hàng.");
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
                    message.success("Đã gửi yêu cầu trả hàng!");
                    refetchOrders();
                } catch (error) {
                    console.error(error);
                    message.error("Gửi yêu cầu thất bại!");
                }
            }
        })
    }

    
    const hasReviewedProduct = (orderId: any, productId: any) => {
        if (!reviewData || !Array.isArray(reviewData)) {
            return false;
        }

        const hasReviewed = reviewData.some(review => 
            review.order_id === orderId && review.product_id === productId
        );
        return hasReviewed;
    }

    const hasReviewedAllProducts = (order: any) => {
        if (!order || !order.items || !reviewData) return false;
        return order.items.every((item: any) => 
            hasReviewedProduct(order._id, item.product._id)
        );
    };

    const hasReviewedSomeProducts = (order: any) => {
        if (!order || !order.items || !reviewData) return false;
        return order.items.some((item: any) => 
            hasReviewedProduct(order._id, item.product._id)
        );
    };

    return (
        <div className='w-full min-h-screen'>
            <div className='w-full h-full rounded-[15px] bg-white min-h-screen mb-4'>
                <div className="w-full ml-1 mt-1.5 mb-2.5 flex h-16 items-center gap-2 px-3">
                    {orderTabs.map((tab) => (
                        <div
                            key={tab.key}
                            onClick={() => setSelectedStatus(tab.key)}
                            className={`
                                text-[14px]
                                relative pb-2 px-2 cursor-pointer text-sm font-medium transition-all duration-200
                                ${selectedStatus === tab.key
                                    ? "text-red-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-red-600 after:rounded-full"
                                    : "text-gray-500 hover:text-gray-700 hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[3px] hover:after:bg-gray-300 hover:after:rounded-full"
                                }
                            `}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4 ml-4 mr-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order: any) => (
                            <Card key={order._id} bordered className="shadow-md rounded-xl transition-all duration-200 hover:shadow-lg">
                                <div className="flex justify-between flex-wrap gap-4">
                                    <div>
                                        <p className="text-gray-500 text-[14px] mb-1">
                                            Mã đơn: <strong className='text-black'>{order._id}</strong>
                                        </p>
                                        <p className="font-bold text-lg mb-2">Sản phẩm trong đơn:</p>
                                        {order.items?.slice(0, 2)?.map((item: any) => {
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
                                                        <p className="font-bold text-base">
                                                            {item.product?.name} - x{item.quantity} -
                                                            <span className="text-red-600 font-semibold ml-1">
                                                                {item.total_price?.toLocaleString()}₫
                                                            </span>
                                                        </p>
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            Giá sản phẩm: {item.unit_price?.toLocaleString()}₫
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
                                            <CalendarOutlined /> Ngày đặt: <strong className='text-black'>{new Date(order.created_at).toLocaleDateString()}</strong>
                                        </p>
                                        <p className="font-bold text-red-600 text-[17px]">
                                            <DollarOutlined /> Tổng: {order.total?.toLocaleString()}₫
                                        </p>
                                        <div className="flex flex-wrap gap-2 justify-end mt-2">
                                            <Link to={`/detailAuth/detailOrder/${order._id}`}>
                                                <Button type="primary" className='text-[16px]' style={{ height: 38 }}>
                                                    Chi tiết
                                                </Button>
                                            </Link>

                                            {order.status === "delivered" && !order.is_return_requested && (
                                                <Popconfirm
                                                    title="Xác nhận bạn đã nhận được hàng và muốn hoàn tất đơn hàng?"
                                                    okText="Hoàn thành"
                                                    cancelText="Hủy"
                                                    onConfirm={() => handleConfirmComplete(order._id)}
                                                >
                                                    <Button
                                                        type="default"
                                                        style={{ height: 38, color: '#16a34a', borderColor: '#16a34a' }}
                                                        className="text-[16px]"
                                                    >
                                                        ✅ Đã nhận
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
                                                    ↩️ Hoàn hàng / hoàn tiền 
                                                </Button>

                                            )}
                                            {order.status === "delivered" && order.is_return_requested && (
                                                <Button
                                                    disabled
                                                    icon={<ExclamationCircleOutlined style={{ fontSize: 16 }} />}
                                                    style={{
                                                        background: 'linear-gradient(90deg, #fde68a, #fcd34d)',
                                                        color: '#78350f',
                                                        border: 'none',
                                                        borderRadius: '7px', // bo tròn pill
                                                        fontWeight: 600,
                                                        padding: '0 15px',
                                                        height: 40,
                                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                        cursor: 'not-allowed'
                                                    }}
                                                >
                                                    Chờ duyệt hoàn hàng
                                                </Button>
                                            )}
                                            {
                                                (order.status === 'pending') && (
                                                    <Popconfirm
                                                        title="Bạn có chắc muốn hủy đơn hàng này ?"
                                                        okText="Hủy"
                                                        cancelText="Không"
                                                        onConfirm={() => handleCancelOrder(order._id, order.status)}
                                                    >
                                                        <Button
                                                            danger
                                                            type="default"
                                                            icon={<ExclamationCircleOutlined />}
                                                            style={{ height: 38 }}
                                                            className="text-[16px]"
                                                        >
                                                            Hủy đơn / Hoàn tiền
                                                        </Button>
                                                    </Popconfirm>
                                                )
                                            }
                                            {order.status === "completed" && (
                                                <div className='flex flex-wrap gap-2 justify-end '>
                                                    {hasReviewedAllProducts(order) ? (
                                                        <Button
                                                            style={{
                                                                height: 38,
                                                                fontSize: 13,
                                                                fontWeight: 500,
                                                                color: '#fff',
                                                                backgroundColor: '#ec4899',
                                                                borderColor: '#ec4899',
                                                                borderRadius: 6,
                                                                boxShadow: '0 2px 6px rgba(236,72,153,0.4)',
                                                                transition: 'all 0.3s ease',
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#db2777';
                                                                e.currentTarget.style.borderColor = '#db2777';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#ec4899';
                                                                e.currentTarget.style.borderColor = '#ec4899';
                                                            }}
                                                            className="text-[16px]"
                                                            onClick={() => handleOpenUpdateReviewModal(order._id)}
                                                        >
                                                            Cập nhập đánh giá
                                                        </Button>
                                                    ): hasReviewedSomeProducts(order) ? (
                                                        <Button
                                                            className="custom-review-btn"
                                                            style={{ height: 38 }}
                                                            onClick={() => handleOpenReviewModal(order._id)}
                                                        >
                                                           
                                                            Tiếp tục đánh giá
                                                        </Button>
                                                    ) : (
                                                            <Button
                                                                
                                                                type="default"
                                                                style={{ height: 38, color: '#2563eb', borderColor: '#2563eb' }}
                                                                className="text-[16px]"
                                                                onClick={() => handleOpenReviewModal(order._id)}
                                                            >
                                                                📝 Đánh giá sản phẩm
                                                            </Button> 
                                                        )
                                                    }
                                                </div>
                                            )}

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
                            <p className="mt-4 text-[13px] font-medium font-sans text-blue-950">Bạn chưa có đơn hàng nào.</p>
                        </div>
                    )}
                </div>

            </div>
            <Modal
                open={isReviewModalVisible}
                onCancel={handleCloseReviewModal}
                footer={null}
                width={800}
            >
                {reviewOrderId && (
                    <Review 
                        orderId={reviewOrderId}
                        onCLose={handleCloseReviewModal}
                        isOpen={isReviewModalVisible}
                    />
                )}
            </Modal>

            <Modal
                open={isUpdateReviewModalVisible}
                onCancel={handleCloseUpdateReviewModal}
                footer={null} 
                width={800} 
            >
                {updateReviewOrderId && (
                    <OrderReviewPage 
                        orderId={updateReviewOrderId}
                        onCLose={handleCloseUpdateReviewModal}
                    />
                )}
            </Modal>
        </div>
    )
    
}

export default OrderHistory;