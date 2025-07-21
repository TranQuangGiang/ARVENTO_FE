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
import { useList } from "../../../../../hooks/useList";

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
          <div className="text-right text-base flex flex-col gap-1">
            <p>Tạm tính: <strong>{order.subtotal.toLocaleString()}₫</strong></p>
            {order.shipping_fee > 0 && (
              <div>
                <Text>
                  Phí vận chuyển:{" "}
                  <strong style={{ color: "black" }}>
                    {Number(order.shipping_fee ).toLocaleString("vi-VN")}₫
                  </strong>
                </Text>
              </div>
            )}
            <p>Giảm giá: <strong className="text-green-600">- {order.discount_amount.toLocaleString()}₫</strong></p>
            
            <p className="text-lg font-bold text-blue-600">Tổng tiền: {order.total.toLocaleString()}₫</p>
          </div>
        </Card>
        {order.status === "delivered" && order.is_return_requested && (
          <Card
            bordered={false}
            className="rounded-lg shadow-sm bg-yellow-50 border border-yellow-200"
            style={{ borderLeft: "3px solid #faad14" }}
          >
            <div className="flex items-start md:items-center justify-between gap-4">
              {/* Icon + Text */}
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-1">⚠️</span>
                <div>
                  <Text strong className="text-gray-800 text-base">Yêu cầu trả hàng của bạn đang được xử lý. Vui lòng chờ phản hồi!</Text>
                  <div className="mt-1">
                    <Text strong>Lý do trả hàng:</Text>{" "}
                    <Text type="danger">
                        {
                          order.timeline
                            ?.filter((t:any) => t.status === "delivered" && t.note?.trim())
                            .pop()?.note || "Không có lý do cụ thể"
                        }
                      </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        {/* Lịch sử đơn hàng */}
        {order.timeline?.length > 0 && (
          <Card title="📍 Lịch sử cập nhật đơn" bordered={false} className="shadow rounded-lg">
            <Timeline
                items={order.timeline.map((item: any, index: number) => ({
                color: getStatusInfo(item.status).color,
                label: new Date(item.changedAt).toLocaleString(),
                children: (
                  <div className="flex flex-col gap-1">
                    <Tag
                      color={getStatusInfo(item.status).color}
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        alignSelf: "flex-start",
                        borderRadius: "4px",
                      }}
                    >
                      {getStatusInfo(item.status).text.toUpperCase()}
                    </Tag>

                    {item.note ? (
                      <div
                        style={{
                          backgroundColor: "#f9f9f9",
                          borderLeft: `4px solid ${getStatusInfo(item.status).color}`,
                          padding: "8px 12px",
                          fontStyle: "italic",
                          fontSize: "13px",
                          color: "#555",
                          borderRadius: "6px",
                        }}
                      >
                        {item.note}
                      </div>
                    ) : (
                      <div style={{ fontSize: "13px", color: "#999" }}>Không có ghi chú.</div>
                    )}
                  </div>
                ),
              }))}
            />
          </Card>

        )}
      </div>
    </div>
  );
};

export default DetailOrderClient;
