import React, { useEffect, useState } from 'react';
import { Modal, Button, Typography, Input, message, Tag, Image, Spin, Card, Table, Divider } from 'antd';
import { useOneData } from '../../../hooks/useOne';
import moment from 'moment';
import axiosInstance from '../../../utils/axiosInstance';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  returning: "Đang trả hàng",
  returned: "Đã trả hàng",
};

const statusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "geekblue",
  processing: "cyan",
  shipping: "purple",
  delivered: "blue",
  completed: "green",
  cancelled: "red",
  returning: "gold",
  returned: "volcano",
};

const ApproveReturnRequest = ({
    isOpen,
    onClose,
    selectedOrder,
    onApproved
}: any) => {
    const [loading, setLoading] = useState(false);
    const orderId = selectedOrder?._id;
    const { data: orderOne, refetch, isLoading } = useOneData({
        resource: `/orders`,
        _id: orderId,
        enabled: orderId,
        
    });
    useEffect(() => {
        if (isOpen && orderId) {
            refetch();
        }
        
    }, [isOpen, refetch, orderId])
   
    const returnRequestTimeline = orderOne?.data?.timeline?.findLast((item: any) => item.note);
    const returnReason = returnRequestTimeline?.note || "Không có lý do được cung cấp";
    const returnRequestDate = returnRequestTimeline?.changedAt  ? moment(returnRequestTimeline.changedAt).format('DD/MM/YYYY HH:mm') : 'N/A';

    const handleComfirm = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.patch(
                `/orders/${orderId}/status`,
                {
                    status: "returning",
                    note: "Yêu cầu hoàn hàng đã được phê duyệt"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            message.success("Duyệt yêu cầu hoàn hàng thành công");
            
            if (onApproved) {
                await onApproved();
            }
            
            onClose();
        } catch (error) {
            message.error("Duyệt yêu cầu thất bại");
        }
        finally {
            setLoading(false);
        }
    }
    // sản phẩm
    const productColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (_:any, product: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Image src={product.selected_variant?.image.url} width={50} preview={false} />
                    <Text>{product.product?.name}</Text>
                </div>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Giá',
            dataIndex: 'unit_price',
            key: 'unit_price',
            render: (price: number) => `${price?.toLocaleString('vi-VN')} đ`,
        },
        {
            title: 'Tổng',
            key: 'total_price',
            render: (_: any, record: any) => `${(record.quantity * record.unit_price).toLocaleString('vi-VN')} đ`,
        },
    ];

    const handleRejectReturn = async () => {
        // Logic từ chối yêu cầu, có thể chuyển trạng thái về 'delivered' hoặc một trạng thái khác
        // Sau đó gọi onStatusUpdated() để cập nhật lại danh sách
        message.info('Tính năng từ chối yêu cầu đang được phát triển.');
        onClose();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className='text-center w-full'>
                    <Title level={4} style={{ marginBottom: 0, textAlign: "center" }}>
                        Duyệt yêu cầu hoàn hàng
                    </Title>
                </div>
                
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="back" onClick={handleRejectReturn}>
                    Từ chối
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={() => handleComfirm()}
                >
                Duyệt hoàn hàng
                </Button>,
            ]}
        >
            { isLoading && isOpen ? (
                <div className='text-center py-8'>
                    <Spin size="large" />
                    <Paragraph style={{ marginTop: 16 }}>Đang tải thông tin đơn hàng...</Paragraph>
                </div>
            ) : (
                <div style={{ padding: '16px 0px' }}>
                    <Card style={{marginBottom: 24}}>
                        <Paragraph>
                            <Text strong>Mã đơn hàng:</Text> <Tag color="blue">{orderOne?.data?._id}</Tag>
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Khách hàng:</Text> {orderOne?.data?.address?.recipient}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Số điện thoại:</Text> {orderOne?.data?.shipping_address?.phone}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Địa chỉ giao hàng:</Text> {orderOne?.data?.address?.address}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>Trạng thái đơn hàng:</Text> <Tag color={statusColors[orderOne?.data.status]}>{statusLabels[orderOne?.data.status]}</Tag>
                        </Paragraph>
                    </Card> 
                    <Card size='small' title="Thông tin hoàn hàng" style={{marginBottom: 24}}>
                        <Paragraph>
                            <Text strong>Lý do khách đưa ra:</Text> {returnReason}
                        </Paragraph>
                        <Paragraph>
                            <ClockCircleOutlined style={{ color: "#faad14" }} className="mr-2" />
                            <Text strong>Ngày yêu cầu hoàn hàng:</Text> <strong className='text-amber-800 ml-1.5'>{returnRequestDate}</strong>
                        </Paragraph>
                    </Card>

                    <Card size='small' title="Danh sách sản phẩm" style={{marginBottom: 24}}>
                        <Table 
                            dataSource={orderOne?.data?.items}
                            columns={productColumns}
                            rowKey={(record: any) => record.product._id}
                            pagination={false}
                            summary={(pageData) => {
                                let total = 0;
                                pageData.forEach(({quantity, price}: any) =>{
                                    total += quantity * price;
                                });
                                return (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <Text strong>Tổng tiền đơn hàng</Text>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <Text strong>{orderOne?.data.total.toLocaleString('vi-VN')} đ</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )
                            }}
                        />
                    </Card>

                    <Card size="small" title="Phương thức thanh toán" style={{ marginBottom: 24 }}>
                        <Paragraph>
                            <Text >{orderOne?.data?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán trực tuyến'}</Text>
                        </Paragraph>
                    </Card>

                    <Divider />
                </div>
            )} 
            
        </Modal>
    );
};

export default ApproveReturnRequest;