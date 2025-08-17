import { Info } from 'lucide-react'
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Checkbox, Image, Input, message, Modal, Popconfirm, Select, Tag, Typography } from 'antd';
import { CalendarOutlined, CopyOutlined, DollarOutlined, ExclamationCircleOutlined, GiftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useOneData } from '../../../../../hooks/useOne';
import moment from 'moment';


const { Text, Title } = Typography;

const HomeAuth = () => {
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
                return "bg-orange-100 text-orange-700"
            case "returned":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // call api khuyến mãi của bạn
    const { data: couponsData, isLoading: isLoadingCoupons } = useList({
        resource: `/coupons/available`
    });
    const CouponCard = ({ coupon }:any ) => {
        const handleCopy = () => {
            navigator.clipboard.writeText(coupon.code);
            message.success("Đã sao chép mã!");
        };

        const isExpired = moment(coupon.end_date).isBefore(moment());

        return (
            <Card
                // Removed w-full to let the parent container control the width
                className={`mb-4 transition-all duration-300 ${isExpired ? 'opacity-60' : ''}`}
                style={{ border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                bodyStyle={{ padding: 0 }} // Slightly smaller padding
            >
                <div className="flex items-center ">
                    <div className="flex-shrink-0">
                        <GiftOutlined style={{ fontSize: 32, color: '#f59e0b' }} /> {/* Smaller icon */}
                    </div>
                    <div className="flex-grow ml-1">
                        <div className="flex items-center justify-between mb-1 mt-0.5">
                            <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: 13 }}> {/* Smaller title */}
                                {coupon.description}
                            </Title>
                        </div>
                        
                        
                        <div className="mt-1.5 w-full text-[10px] text-gray-500 flex justify-between"> {/* Very small font size for details */}
                            <span>
                                Áp dụng cho đơn hàng từ **{coupon.min_amount?.toLocaleString() || 0}₫**
                            </span>
                            <span className='ml-1'>
                                Hết hạn: <strong>{moment(coupon.expiryDate).format('DD/MM/YYYY')}</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };


    const { data:orderData, refetch } = useList({
        resource: `/orders/my`
    });
    console.log(">>> orderData:", orderData);
    useEffect(() => {
        refetch();
    }, [refetch])
    const orders = (orderData?.data.orders || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

    // xác nhận đã nhận hàng
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
            refetch();
        } catch (error) {
            console.error(error);
            message.error("Không thể xác nhận hoàn tất đơn hàng.");
        }

    }


    // luồng yêu cầu hoàn hàng
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
                    refetch();
                } catch (error) {
                    console.error(error);
                    message.error("Gửi yêu cầu thất bại!");
                }
            }
        })
    }

    // hủy đơn 
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
                    <p style={{ fontWeight: 500, marginBottom: 8 }}>Vui lòng chọn lý do hủy đơn hàng:</p>

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
                    reasonRef.current !== "Khác"
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
                    refetch();
                } catch (error) {
                    console.error(error);
                    message.error("Hủy đơn hàng thất bại ");
                }
            }
        });
    };
    return (
        <div className='w-full'>
            <div className='w-full h-14 border border-blue-500 rounded-[7px] flex items-center mb-3 bg-[#ebf3fe]'>
                <span className='w-full flex items-center justify-between'>  
                    <p className='flex text-[15px] ml-4 items-center font-medium'><Info className='mr-2 text-blue-600' style={{width: 20}} /> Thêm địa chỉ để đặt hàng nhanh hơn </p>
                </span>
                
            </div>
            <div className='w-full flex '>
                <div className='w-3/4 bg-white rounded-[15px] max-h-screen p-5'>
                    <h4 className='text-[17px] font-semibold '>Đơn hàng gần đây</h4>
                    <div className=' flex-col items-center gap-4 mt-4'>
                        { orders.length > 0 ? (
                                orders.map((order:any) => (
                                    
                                    <Card key={order._id} 
                                        bordered 
                                        className="w-full"
                                        style={{
                                            borderRadius: 12,
                                            border: "1px solid #e5e7eb", // Màu xám nhạt
                                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // Đổ bóng nhẹ
                                        }}
                                    >
                                        <div className="w-full flex justify-between gap-4">
                                            <div>
                                                <p className="text-gray-500 text-[14px] mb-1">
                                                    Mã đơn: <strong className='text-black'>{order._id}</strong>
                                                </p>
                                                <p className="font-bold text-gray-700 text-[17px] mb-3.5">Sản phẩm trong đơn:</p>
                                                {order.items?.map((item: any) => {
                                                    return (
                                                        <div key={item?.product?._id} className="flex items-center gap-3 mb-2">
                                                            {item.selected_variant?.image?.url ? (
                                                                <img
                                                                    src={item.selected_variant.image.url}
                                                                    className="rounded w-[70px] h-[70px]"
                                                                />
                                                                ) : (
                                                                <div className="w-[70px] h-[70px] bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded">
                                                                    No image
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-bold text-sm">
                                                                    {item?.product?.name} - x{item.quantity} 
                                                                    
                                                                </p>
                                                                <p className="text-gray-600 text-sm">
                                                                    Giá sản phẩm: {item.unit_price?.toLocaleString()}₫
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="flex flex-col items-end gap-2 min-w-[220px]">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusStyle(order.status)}`}>
                                                    {getOrderStatusLabel(order.status)}
                                                </span>
                                                <p className="text-gray-600 text-[14px]">
                                                    <CalendarOutlined /> Ngày tạo: <strong className='text-black'>{new Date(order.created_at).toLocaleDateString()}</strong>
                                                </p>
                                                <p className="font-bold text-red-600 text-[17px]">
                                                    <DollarOutlined /> Tổng: {order.total?.toLocaleString()}₫
                                                </p>
                                                <div className='flex flex-wrap gap-1 justify-end mt-2'>
                                                    <Link to={`/detailAuth/detailOrder/${order._id}`}>
                                                        <Button type="primary" className='text-[17px]' style={{height: 35}}>Chi tiết</Button>
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
                                                                style={{ height: 35, color: '#16a34a', borderColor: '#16a34a' }}
                                                                className="text-[16px]"
                                                            >
                                                                ✅ Đã nhận
                                                            </Button>
                                                        </Popconfirm>
                                                    )}
                                                    {order.status === "delivered" && !order.is_return_requested && (
                                                        <Button
                                                            type="default"
                                                            style={{ height: 35, color: '#d97706', borderColor: '#d97706' }}
                                                            className="text-[16px]"
                                                            onClick={() => handleRequestReturn(order._id)}
                                                        >
                                                            Hoàn hàng / hoàn tiền
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
                                                                height: 36,
                                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                                cursor: 'not-allowed'
                                                            }}
                                                        >
                                                            Chờ duyệt hoàn hàng
                                                        </Button>
                                                    )}
                                                </div>
                                                
                                                {
                                                    (order.status === "pending") && (
                                                        <Popconfirm 
                                                            title="Bạn có chắc muốn hủy đơn hàng này ?"
                                                            okText="Hủy"
                                                            cancelText="Không" 
                                                            onConfirm={() => handleCancelOrder(order._id, order.status)}
                                                        >
                                                            <Button
                                                                danger
                                                                icon={<ExclamationCircleOutlined />}
                                                            >
                                                                Hủy đơn / Hoàn tiền
                                                            </Button>
                                                        </Popconfirm> 
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className='w-full relative h-[250px] bg-white rounded-[15px] '>
                                    <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                                        <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                                        {/* Nội dung ở phía trên */}
                                        <span className="relative z-10 w-full flex flex-col items-center">
                                            <img className="w-[170px]" src="/cartD.png" alt="" />
                                        </span>
                                        <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào!</p>
                                    </div>
                                </div>
                            )
                        }  
                    </div>
                </div>
                <div className='w-1/4 relative bg-white ml-3 h-[250px] rounded-[15px]'>
                    <h4 className='absolute top-4 text-[17px] font-semibold left-4'>Ữu đãi của bạn </h4>
                    {couponsData?.data?.length > 0 ? (
                        couponsData.data.map((coupon:any) => (
                            <div className='absolute top-13 w-[95%] ml-1.5 z-10'>
                                <CouponCard key={coupon._id} coupon={coupon} />
                            </div>
                            
                        ))
                    ) : (
                        <div className="relative w-full flex flex-col items-center justify-center py-8">
                            <div className="absolute w-[170px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                            <span className="relative z-10 w-full flex flex-col items-center"> 
                                <img className="w-[170px]" src="/cartD.png" alt="" />
                            </span>
                            <p className='mt-4 text-sm font-medium font-sans text-blue-950 text-center'>
                                Bạn chưa có ưu đãi nào? Hãy theo dõi để nhận những mã giảm giá hấp dẫn!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomeAuth