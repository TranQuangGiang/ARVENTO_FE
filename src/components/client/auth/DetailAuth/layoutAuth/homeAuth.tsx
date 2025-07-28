import { Info } from 'lucide-react'
import { useList } from '../../../../../hooks/useList';
import { Button, Card, Image, Popconfirm } from 'antd';
import { CalendarOutlined, DollarOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const HomeAuth = () => {
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
                return "Returning"
            case "returned":
                return "Returned";
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

    const { data:orderData, refetch } = useList({
        resource: `/orders/my`
    });
    const orders = (orderData?.data.orders || [])
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2); // Lấy 2 đơn mới nhất
    return (
        <div className='w-full'>
            <div className='w-full h-14 border border-blue-500 rounded-[7px] flex items-center mb-3 bg-[#ebf3fe]'>
                <span className='w-full flex items-center justify-between'>  
                    <p className='flex text-[15px] ml-4 items-center font-medium'><Info className='mr-2 text-blue-600' style={{width: 20}} /> Thêm địa chỉ để đặt hàng nhanh hơn </p>
                </span>
                
            </div>
            <div className='w-full flex '>
                <div className='w-3/4 flex flex-col items-center gap-4'>
                    { orders.length > 0 ? (
                        orders.map((order:any) => (
                            <Card key={order._id} bordered className="shadow-sm ">
                                <div className="w-full flex justify-between gap-4">
                                    <div>
                                        <p className="text-gray-500 text-[12px] mb-1">
                                            SKU: <strong>{order._id}</strong>
                                        </p>
                                        <p className="font-bold text-lg mb-2">Products in order:</p>
                                        {order.items?.map((item: any) => {
                                        const itemTotal = item.quantity * (item.unit_price || 0);
                                            return (
                                                <div key={item.product._id} className="flex items-center gap-3 mb-2">
                                                    {item.selected_variant?.image?.url ? (
                                                        <Image
                                                            src={item.selected_variant.image.url}
                                                            width={70}
                                                            height={70}
                                                            preview={false}
                                                            className="rounded"
                                                        />
                                                        ) : (
                                                        <div className="w-[70px] h-[70px] bg-gray-100 flex items-center justify-center text-xs text-gray-500 rounded">
                                                            No image
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {item.product.name} - x{item.quantity} - 
                                                            <span className="text-red-600 font-semibold ml-1">
                                                                {itemTotal.toLocaleString()}₫
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

                                    <div className="flex flex-col items-end gap-2 min-w-[220px]">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusStyle(order.status)}`}>
                                            {getOrderStatusLabel(order.status)}
                                        </span>
                                        <p className="text-gray-600 text-[15px]">
                                            <CalendarOutlined /> Order date: {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="font-bold text-red-600 text-[17px]">
                                            <DollarOutlined /> Total: {order.total?.toLocaleString()}₫
                                        </p>
                                        <Link to={`/detailAuth/detailOrder/${order._id}`}>
                                            <Button type="primary" className='text-[17px]' style={{height: 40}}>View order details</Button>
                                        </Link>
                                        {
                                            order.status === "pending" || order.status === "confirmed" && (
                                                <Popconfirm title="Bạn không thể hủy tại đây !" okText="Ok" cancelText="Hủy" >
                                                    <Button
                                                        danger
                                                        icon={<ExclamationCircleOutlined />}
                                                    >
                                                        Huỷ đơn hàng
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
                            <h4 className='absolute top-4 text-[17px] font-semibold left-4'>Đơn hàng gần đây</h4>
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
                <div className='w-1/4 relative bg-white ml-3 h-[250px] rounded-[15px]'>
                    <h4 className='absolute top-4 text-[17px] font-semibold left-4'>Ữu đãi của bạn </h4>
                    <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                        <div className="absolute w-[170px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                        {/* Nội dung ở phía trên */}
                        <span className="relative z-10 w-full flex flex-col items-center">
                            <img className="w-[170px]" src="/voucher.png" alt="" />
                        </span>
                        <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có ưu đãi nào ?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeAuth