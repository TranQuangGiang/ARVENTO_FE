import React from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  List,
  Image,
  Tag,
  Typography,
  Divider,
  Row,
  Col,
  Timeline,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  TruckOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useOneData } from "../../../../../hooks/useOne";

const { Title, Text } = Typography;
type StatusKey =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancelled"
  | "returning"
  | "returned";

type StatusInfo = {
  text: string;
  color: string;
  icon: JSX.Element;
};
// Mapping order statuses to colors and labels in Vietnamese
    const statusMap: Record<StatusKey, StatusInfo> = {
        pending: {
            text: "Chờ xác nhận",
            color: "orange",
            icon: <ClockCircleOutlined />,
        },
        confirmed: {
            text: "Đã xác nhận",
            color: "geekblue",
            icon: <CheckCircleOutlined />,
        },
        processing: {
            text: "Đang xử lý",
            color: "cyan",
            icon: <SyncOutlined spin />,
        },
        shipping: {
            text: "Đang giao hàng",
            color: "purple",
            icon: <TruckOutlined />,
        },
        delivered: {
            text: "Đã giao hàng",
            color: "blue",
            icon: <CheckCircleOutlined />,
        },
        completed: {
            text: "Hoàn thành",
            color: "green",
            icon: <CheckCircleOutlined />,
        },
        cancelled: { 
            text: "Đã hủy", 
            color: "red", 
            icon: <CloseCircleOutlined /> 
        },
        returning: {
            text: "Đang trả hàng",
            color: "gold",
            icon: <ArrowLeftOutlined />,
        },
        returned: {
            text: "Đã trả hàng",
            color: "volcano",
            icon: <UndoOutlined />,
        },
    };

const DetailOrderClient = () => {
  const { id } = useParams();
  const { data } = useOneData({ resource: "/orders", _id: id });

  const order = data?.data;
  if (!order) return null;

  const getStatusInfo = (status:StatusKey) =>
    statusMap[status] || {
      text: status,
      color: "gray",
      icon: <InfoCircleOutlined />,
    };

    const getTimelineItems = (timeline:any) => {
        // Sắp xếp timeline theo thời gian tăng dần
        const sortedTimeline = [...timeline].sort(
        (a:any, b:any) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
        );

        return sortedTimeline.map((item) => {
            const { text, color, icon } = getStatusInfo(item.status);
            return {
                dot: icon,
                color: color,
                children: (
                <div>
                    <Text strong className="capitalize">
                        {text}
                    </Text>
                    <br />
                    <Text type="secondary">
                        {new Date(item.changedAt).toLocaleString("vi-VN")}
                    </Text>
                    <p className="mt-1 text-gray-600">
                        {item.note || <span className="italic text-gray-400">Không có ghi chú.</span>}
                    </p>
                </div>
                ),
            };
        });
    };

  return (
        <div className="">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Order Header */}
                <Card className="rounded-xl shadow-lg border-t-4 border-blue-500">
                    <h3 className="text-[22px] font-sans font-bold mb-3">Chi tiết đơn hàng</h3>
                    <Row justify="space-between" align="middle" className="mb-4">
                        <Col>
                            <Title level={5} className=" text-[17px] text-gray-800">
                                Đơn hàng #{order._id}
                            </Title>
                            <Text type="secondary">
                                Đặt hàng vào: {new Date(order.created_at).toLocaleString("vi-VN")}
                            </Text>
                        </Col>
                        <Col>
                            <Tag
                                color={getStatusInfo(order.status).color}
                                className="text-lg px-4 py-1 rounded-full"
                            >
                                {getStatusInfo(order.status).text.toUpperCase()}
                            </Tag>
                        </Col>
                    </Row>
                </Card>

                {/* Shipping & Order Items */}
                <Row gutter={[14, 14]}>
                    <div className="mt-3 w-full flex">
                        <Col xs={24} lg={16}>
                            <Card
                                title={
                                    <span className="flex items-center">
                                    <ShoppingOutlined className="mr-2" /> Sản phẩm trong đơn hàng
                                    </span>
                                }
                                className="rounded-xl shadow-lg"
                            >
                            <List
                                itemLayout="horizontal"
                                dataSource={order.items}
                                renderItem={(item:any) => (
                                <List.Item className="!py-4">
                                    <List.Item.Meta
                                        avatar={
                                            <Image
                                            width={80}
                                            height={80}
                                            src={
                                                item.selected_variant?.image?.url ||
                                                item.product.images[0]?.url
                                            }
                                            className="rounded-lg object-cover"
                                            />
                                        }
                                        title={
                                            <div className="flex justify-between items-center">
                                            <Text strong className="text-gray-800">
                                                {item.product.name}
                                            </Text>
                                            <Text className="text-blue-600 font-semibold text-lg">
                                                {item.total_price?.toLocaleString("vi-VN")}₫
                                            </Text>
                                            </div>
                                        }
                                        description={
                                            <>
                                            <Text type="secondary">
                                                Giá sản phẩm: {item.unit_price?.toLocaleString("vi-VN")}₫
                                            </Text>
                                            <div className="flex items-center mt-1">
                                                <Text className="mr-2">Số lượng: </Text>
                                                <Tag color="blue">{item.quantity}</Tag>
                                                {item.selected_variant?.color?.name && (
                                                <>
                                                    <Divider type="vertical" />
                                                    <Text>
                                                        Màu sắc: {item.selected_variant.color.name}
                                                    </Text>
                                                </>
                                                )}
                                            </div>
                                            </>
                                        }
                                    />
                                </List.Item>
                                )}
                            />
                            <Divider dashed />
                            <div className="text-right space-y-2 text-gray-700">
                                <div className="flex justify-between">
                                    <Text>Tổng tiền sản phẩm:</Text>
                                    <Text strong>{order.subtotal?.toLocaleString("vi-VN")}₫</Text>
                                </div>
                                {order.shipping_fee > 0 && (
                                    <div className="flex justify-between">
                                        <Text>Phí vận chuyển:</Text>
                                        <Text style={{color: "blue"}} strong>
                                            {Number(order.shipping_fee)?.toLocaleString("vi-VN")}₫
                                        </Text>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <Text>Giảm giá:</Text>
                                    <Text strong style={{color: "green"}}>
                                        - {order.discount_amount?.toLocaleString("vi-VN")}₫
                                    </Text>
                                </div>
                                <Divider className="!my-2" />
                                <div className="flex justify-between font-bold">
                                    <Text>Tổng cộng:</Text>
                                    <Text style={{color: "red", fontSize: 17}}>{order.total?.toLocaleString("vi-VN")}₫</Text>
                                </div>
                            </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <div className="space-y-3">
                                <Card
                                    title={
                                        <span className="flex items-center">
                                        <TruckOutlined className="mr-2" /> Thông tin giao hàng
                                        </span>
                                    }
                                    className="rounded-xl shadow-lg"
                                >
                                    <div className="space-y-2 text-gray-700">
                                        <div className="flex items-center">
                                            <UserOutlined className="mr-2" />
                                            
                                            <span className="text-right">{order.address?.recipient || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <PhoneOutlined className="mr-2" />
                                            
                                            <span className="text-right">{order.shipping_address?.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <HomeOutlined className="mr-2" />
                                            
                                            <span className="text-right text-[13px]">
                                                {order.address?.address || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <DollarOutlined className="mr-2" />
                                            
                                            <span className="text-gray-600">
                                                {order.payment_method === 'cod' ? 'Thanh toán khi nhận nhà' : order.payment_method || "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center mb-2">
                                            <FileTextOutlined className="mr-2" />
                                            
                                            <span className=" text-gray-600">
                                                {order.note || "Không có"}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </div>
                    {/* Shipping & Order History */}
                    
                </Row>
                <div className="mt-3 w-full">
                    <Row gutter={[24, 24]}>
                        <Col span={24} className="space-y-6">
                            {order.status === "delivered" && order.is_return_requested && (
                                <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow-lg">
                                    <Card
                                        className="bg-yellow-100 border-l-4 border-yellow-500 rounded-xl shadow-lg"
                                        title={
                                            <span className="flex items-center text-yellow-700">
                                            <WarningOutlined className="mr-2" /> Yêu cầu trả hàng
                                            </span>
                                        }
                                    >
                                        <Text className="text-yellow-900">
                                            Yêu cầu trả hàng của bạn đang được xử lý.
                                        </Text>
                                        <p className="mt-2 flex items-center text-yellow-900">
                                            <Text strong>Lý do:</Text>
                                            <Text className="block ml-1">
                                            {order.timeline
                                                ?.filter(
                                                (t:any) => t.status === "delivered" && t.note?.trim()
                                                )
                                                .pop()?.note || "Không có lý do cụ thể."}
                                            </Text>
                                        </p>
                                    </Card>
                                </div>
                            )}
                            <div className="mt-3">
                                <Card
                                    title={
                                    <span className="flex items-center">
                                        <ClockCircleOutlined className="mr-2" /> Lịch sử đơn hàng
                                    </span>
                                    }
                                    className=" rounded-xl shadow-lg w-full"
                                >
                                    <Timeline items={getTimelineItems(order.timeline)} />
                                </Card>
                            </div>
                           
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default DetailOrderClient;



