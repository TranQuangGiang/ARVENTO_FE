import React from "react";
import { useParams } from "react-router-dom";
import {
  Card, List, Image, Tag, Typography, Divider, Row, Col,
} from "antd";
import {
  UserOutlined, PhoneOutlined, HomeOutlined, TagOutlined,
  SyncOutlined, FileTextOutlined, ClockCircleOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { Timeline } from "antd";
import { useOneData } from "../../../../../hooks/useOne";

const { Title, Text } = Typography;

const statusColorMap: Record<string, { text: string; color: string }> = {
  pending: { text: "pending", color: "orange" },
  confirmed: { text: "confirmed", color: "geekblue" },
  processing: { text: "processing", color: "cyan" },
  shipping: { text: "shipping", color: "purple" },
  delivered: { text: "delivered", color: "blue" },
  completed: { text: "completed", color: "green" },
  cancelled: { text: "cancelled", color: "red" },
  returned: { text: "returned", color: "volcano" },
};

const DetailOrderClient = () => {
  const { id } = useParams();
  const { data } = useOneData({ resource: "/orders", _id: id });
  const order = data?.data;

  if (!order) return null;

  const getStatusInfo = (status: string) => statusColorMap[status] || { text: status, color: "gray" };

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 rounded-[15px]">
      <div className="max-w-6xl mx-auto space-y-6">
        <Title level={3} className="text-blue-600">🧾 Chi tiết đơn hàng</Title>

        {/* Thông tin giao hàng và đơn hàng */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Thông tin giao hàng" bordered={false} className="shadow rounded-lg min-h-[246px]">
              <p><UserOutlined /> <strong>Người nhận:</strong> <span className="float-right">{order.address?.recipient || "-"}</span></p>
              <p className="mt-2"><PhoneOutlined /> <strong>Điện thoại:</strong> <span className="float-right">{order.shipping_address?.phone || "-"}</span></p>
              <p className="mt-2"><HomeOutlined /> <strong>Địa chỉ:</strong> <span className="float-right">{order.shipping_address?.fullAddress}</span></p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Thông tin đơn hàng" bordered={false} className="shadow rounded-lg">
              <p><TagOutlined /> <strong>Mã đơn:</strong> <span className="float-right">{order._id}</span></p>
              <p className="mt-2"><SyncOutlined /> <strong>Trạng thái:</strong>
                <Tag color={getStatusInfo(order.status).color} className="float-right">{getStatusInfo(order.status).text}</Tag>
              </p>
              <p className="mt-2"><DollarOutlined /> <strong>Phương thức:</strong> <span className="float-right">{order.payment_method || "-"}</span></p>
              <p className="mt-2"><FileTextOutlined /> <strong>Ghi chú:</strong> <span className="float-right">{order.note || "-"}</span></p>
              <p className="mt-2"><ClockCircleOutlined /> <strong>Ngày đặt:</strong> <span className="float-right">{new Date(order.created_at).toLocaleString()}</span></p>
            </Card>
          </Col>
        </Row>

        {/* Danh sách sản phẩm */}
        <Card title="🛍️ Sản phẩm trong đơn" bordered={false} className="shadow rounded-lg">
          <List
            itemLayout="horizontal"
            dataSource={order.items}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Image
                      width={70}
                      className="rounded"
                      src={item.selected_variant?.image?.url || item.product.images[0]?.url}
                    />
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{item.product.name}</Text>
                        <span className="ml-2 text-gray-500">x{item.quantity}</span>
                        {item.selected_variant?.color?.name && (
                          <p className="text-sm">Màu: <strong>{item.selected_variant.color.name}</strong></p>
                        )}
                      </div>
                      <Text className="text-red-500 font-semibold">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </Text>
                    </div>
                  }
                  description={<Text>Đơn giá: {item.price.toLocaleString()}₫</Text>}
                />
              </List.Item>
            )}
          />
          <Divider />
          <div className="text-right text-base">
            <p>Tạm tính: <strong>{order.subtotal.toLocaleString()}₫</strong></p>
            <p>Giảm giá: <strong className="text-green-600">- {order.discount_amount.toLocaleString()}₫</strong></p>
            <p className="text-lg font-bold text-blue-600">Tổng tiền: {order.total.toLocaleString()}₫</p>
          </div>
        </Card>

        {/* Lịch sử đơn hàng */}
        {order.timeline?.length > 0 && (
          <Card title="📍 Lịch sử cập nhật đơn" bordered={false} className="shadow rounded-lg">
            <Timeline>
              {order.timeline.map((item: any, index: number) => (
                <Timeline.Item
                  key={index}
                  color={getStatusInfo(item.status).color}
                  label={new Date(item.changedAt).toLocaleString()}
                >
                  {getStatusInfo(item.status).text}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DetailOrderClient;
