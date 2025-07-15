import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card, List, Image, Tag, Spin, Typography, Divider, Row, Col, Button,
} from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined, PhoneOutlined, HomeOutlined, TagOutlined,
  SyncOutlined, FileTextOutlined, ClockCircleOutlined,
  ReloadOutlined, DollarOutlined
} from "@ant-design/icons";
import { useOneDataOrder } from "../../../hooks/useOnedataOrder";

const { Title, Text } = Typography;

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

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useOneDataOrder({
    resource: `/orders/${id}`,
    enabled: !!id,
  });

  const order = data?.data;

  useEffect(() => {
    if (id) refetch();
  }, [id]);

  if (isLoading || !order?._id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-50 min-h-screen px-6 py-10"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <Title level={3} className="text-center">Chi tiết đơn hàng</Title>

        {/* Thông tin Giao hàng & Đơn hàng */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Thông tin giao hàng" bordered={false} className="custom-card-title rounded-lg flex flex-col min-h-[283px] shadow-md">
              <p className="mt-0"><UserOutlined /> <strong>Người nhận:</strong> <span className="float-right">{order.address?.recipient || "-"}</span></p>
              <p className="mt-1"><PhoneOutlined /> <strong>Điện thoại:</strong> <span className="float-right">{order.shipping_address?.phone || "-"}</span></p>
              <p className="mt-1"><HomeOutlined /> <strong>Địa chỉ:</strong> <span className="float-right">{order.shipping_address?.fullAddress}</span></p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Thông tin đơn hàng" bordered={false} className="custom-card-title rounded-lg flex flex-col min-h-[257px] shadow-md">
              <p className="mt-0"><TagOutlined /> <strong>Mã đơn:</strong> <span className="float-right">{order._id}</span></p>
              <p className="mt-1"><SyncOutlined /> <strong>Trạng thái:</strong>
                <Tag color={statusColors[order.status]} className="float-right">{order.status.toUpperCase()}</Tag>
              </p>
              <p className="mt-1"><DollarOutlined /> <strong>Thanh toán:</strong>
                <Tag color={order.payment_status === "paid" ? "green" : "orange"} className="float-right">{order.payment_status.toUpperCase()}</Tag>
              </p>
              <p className="mt-1"><DollarOutlined /> <strong>Phương thức:</strong> <span className="float-right">{order.payment_method?.toUpperCase() || "-"}</span></p>
              <p className="mt-1"><FileTextOutlined /> <strong>Ghi chú:</strong> <span className="float-right">{order.note || "-"}</span></p>
              <p className="mt-1"><ClockCircleOutlined /> <strong>Tạo lúc:</strong> <span className="float-right">{new Date(order.created_at).toLocaleString()}</span></p>
              <p className="mt-1"><ReloadOutlined /> <strong>Cập nhật:</strong> <span className="float-right">{new Date(order.updated_at).toLocaleString()}</span></p>
            </Card>
          </Col>
        </Row>

        {/* Danh sách sản phẩm */}
        <Card title="Sản phẩm trong đơn" bordered={false} className="custom-card-title rounded-lg flex flex-col shadow-md">
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
          <div className="text-right space-y-2">
            <Text>
              Mã giảm giá: <strong>{order.applied_coupon?.code || "-"}</strong>
            </Text>
            <br />
            <Text>
              Giảm giá: <span className="text-green-600">-{order.discount_amount?.toLocaleString()}₫</span>
            </Text>
            <br />
            <Text>
              Phí vận chuyển: <span className="text-blue-600">{order.shipping_fee?.toLocaleString()}₫</span>
            </Text>
            <br />
            <Text strong style={{ fontSize: 18 }}>
              Tổng đơn hàng: <span className="text-red-500">{order.total?.toLocaleString()}₫</span>
            </Text>
          </div>

        </Card>

        {/* Timeline trạng thái */}
        {order.timeline && order.timeline.length > 0 && (
          <Card title="Lịch sử trạng thái" bordered={false} className="shadow rounded-lg">
            <List
              dataSource={order.timeline}
              renderItem={(item: any, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={<Tag color={statusColors[item.status]}>{item.status.toUpperCase()}</Tag>}
                    description={
                      <>
                        <Text>Thời gian: {new Date(item.changedAt).toLocaleString()}</Text><br />
                        <Text>Ghi chú: {item.note || "-"}</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Nút quay lại */}
        <div className="text-right mt-4">
          <Button type="default" onClick={() => navigate("/admin/listorder")}>Quay lại</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailOrder;
