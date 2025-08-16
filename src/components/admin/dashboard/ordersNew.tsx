import { useList } from '../../../hooks/useList'
import { Link } from 'react-router-dom'
import { Button, Card, Table, Tag, Typography } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

const { Title } = Typography;
const OrdersNew = () => {
    const limit = `limit=5`
    const { data } = useList({
        resource:  `/orders/recent?${limit}`,
    })
    const recentOrders = useMemo(() => {
        return data?.data || [];
    }, [data]);
    
    const statusOptions = [
        "pending", "confirmed", "processing", "shipping",
        "delivered", "completed", "cancelled", "returning" , "returned",
    ];

    const statusColors: Record<string, string> = {
        pending: "#faad14",
        confirmed: "#1677ff",
        processing: "#13c2c2",
        shipping: "#722ed1",
        delivered: "#2f54eb",
        completed: "#52c41a",
        cancelled: "#ff4d4f",
        returning: "#ffc53d",
        returned: "#d46b08",
    };

    const statusLabels: Record<string, string> = {
        pending: "Đang chờ xử lý",
        confirmed: "Đã xác nhận",
        processing: "Đang xử lý",
        shipping: "Đang giao hàng",
        delivered: "Đã giao hàng",
        completed: "Hoàn thành",
        cancelled: "Đã hủy",
        returning: "Đang trả hàng",
        returned: "Đã trả hàng",
    };
    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_: any, __:any, index:number) => index + 1,
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "_id",
            key: "_id",
        },
        {
            title: "Khách hàng",
            dataIndex: ["user", "name"],
            key: "user",
        },
        {
            title: "Địa chỉ email",
            dataIndex: ["user", "email"],
            key: "email",
        },
        {
            title: "Địa chỉ giao hàng",
            dataIndex: ["address", "address"],
            key: "address",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag className="custom-tag" color={statusColors[status]}>
                    {statusLabels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => {
                return (
                <div className="flex flex-col gap-2">
                    {/* Nút xem chi tiết */}
                    <Link to={`/admin/orderDetail/${record._id}`}>
                        <Button icon={<EyeOutlined />}>Chi tiết</Button>
                    </Link>
                </div>
                );
            },
        }
    ]
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                >
                <div className="mt-10 bg-gray-100">
                    <Card
                        bordered={false}
                        style={{
                            background: "#fff",
                            borderRadius: 8,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                    <Title level={3}>Danh sách đơn hàng mới nhất</Title>
                    <Table
                        dataSource={recentOrders}
                        columns={columns}
                        rowKey="_id"
                        bordered
                    />
                    </Card>
                </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default OrdersNew