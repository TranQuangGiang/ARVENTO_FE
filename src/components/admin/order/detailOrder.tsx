import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  List,
  Image,
  Tag,
  Spin,
  Typography,
  Divider,
  Row,
  Col,
  Button,
  message,
} from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  TagOutlined,
  SyncOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useOneDataOrder } from "../../../hooks/useOnedataOrder";
import axiosInstance from "../../../utils/axiosInstance";
import { CalendarDays } from "lucide-react";

const { Title, Text } = Typography;

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
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      className="bg-gray-100 min-h-screen p-8 lg:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <Title level={2} className="text-center font-bold text-gray-800">
          Chi tiết đơn hàng
        </Title>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content: Order Details & Products */}
          <div className="w-full lg:w-[70%] space-y-8">
            {/* Order Summary Card */}
            <Card
              className="rounded-xl shadow border-none"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-1">
                  <p className="flex items-center text-[17px]">
                    <span className="font-semibold text-gray-600">Mã đơn hàng:</span>{" "}
                    <strong className="text-blue-500 ml-2">#{order._id}</strong>
                  </p>
                  <p className="flex items-center text-sm text-gray-500">
                    <CalendarDays style={{ width: 17 }} className="mr-2" />
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Tag
                    color={statusColors[order.status]}
                    className="float-right text-base font-semibold px-4 py-1"
                    style={{
                      marginTop: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {statusLabels[order.status].toUpperCase()}
                  </Tag>
                </div>
              </div>
            </Card>
            <div className="mt-8">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={10}>
                  <Card
                    title={<span className="font-bold">Thông tin khách hàng</span>}
                    headStyle={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}
                    bordered={false}
                    className="rounded-xl shadow-lg h-full"
                  >
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <UserOutlined className="text-blue-500" />
                        <span className="font-semibold text-gray-800">{order?.user?.name || "-"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <PhoneOutlined className="text-blue-500" />
                        <span>{order?.shipping_address?.phone || "-"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MailOutlined className="text-blue-500" />
                        <span>{order?.user?.email || "-"}</span>
                      </p>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={14}>
                  <Card
                    title={<span className="font-bold">Thông tin người nhận</span>}
                    headStyle={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}
                    bordered={false}
                    className="rounded-xl shadow-lg h-full"
                  >
                    <div className="space-y-2">
                      <p className="flex items-start gap-2">
                        <UserOutlined className="text-blue-500 mt-1" />
                        <span className="font-semibold text-gray-800">{order?.address?.recipient || "-"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <PhoneOutlined className="text-blue-500" />
                        <span>{order?.shipping_address?.phone || "-"}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <HomeOutlined className="text-blue-500 mt-1" />
                        <span>{order?.address?.address || "-"}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FileTextOutlined className="text-blue-500" />
                        <span>{order?.address?.note || "No notes"}</span>
                      </p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
            

            {/* Product List */}
            <Card
              title={<span className="font-bold">🛍️ Sản phẩm trong đơn</span>}
              headStyle={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}
              bordered={false}
              className="rounded-xl shadow-lg"
            >
              <List
                itemLayout="horizontal"
                dataSource={order.items}
                renderItem={(item: any) => (
                  <List.Item className="py-4">
                    <List.Item.Meta
                      avatar={
                        <Image
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                          src={item.selected_variant?.image?.url || item.product.images[0]?.url || "https://via.placeholder.com/80"}
                          preview={false}
                        />
                      }
                      title={
                        <div className="flex items-center justify-between">
                          <div>
                            <Text strong className="text-base text-gray-800">
                              {item.product?.name}
                            </Text>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <span>Qty: {item.quantity}</span>
                              {item.selected_variant?.color?.name && (
                                <span className="ml-4">
                                  Color: <strong>{item.selected_variant.color.name}</strong>
                                </span>
                              )}
                            </div>
                          </div>
                          <Text className="text-red-500 font-bold text-lg">
                            {item.total_price?.toLocaleString()}₫
                          </Text>
                        </div>
                      }
                      description={
                        <Text className="text-gray-500">
                          Unit Price: {item?.unit_price.toLocaleString()}₫
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Status Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-7">
                <Card
                  title={<span className="font-bold">Lịch sử trạng thái</span>}
                  headStyle={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}
                  bordered={false}
                  className="rounded-xl shadow-lg h-full"
                >
                  <List
                    dataSource={order.timeline}
                    renderItem={(item: any, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          avatar={<SyncOutlined className="text-xl text-blue-500" />}
                          title={
                            <Tag
                              color={statusColors[item.status]}
                              className="font-semibold text-base px-3 py-1"
                              style={{
                                borderRadius: "9999px",
                                textTransform: "capitalize",
                              }}
                            >
                              {statusLabels[item.status]?.toUpperCase()}
                            </Tag>
                          }
                          description={
                            <>
                              <Text className="text-gray-600">
                                Time: {new Date(item.changedAt).toLocaleString()}
                              </Text>
                              <br />
                              <Text className="text-gray-500">
                                Note: {item.note || "-"}
                              </Text>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar: Payment Summary & Actions */}
          <div className="w-full lg:w-[30%] space-y-8">
            <Card
              title={<span className="font-bold">Tóm tắt thanh toán</span>}
              headStyle={{ backgroundColor: '#fafafa', padding: '16px 24px', borderBottom: '1px solid #e8e8e8' }}
              bordered={false}
              className="rounded-xl shadow-lg"
            >
              <div className="flex flex-col space-y-3 text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Tổng tiền sản phẩm</span>
                  <Text>{order.subtotal?.toLocaleString()}₫</Text>
                </div>
                <div className="flex justify-between items-center">
                  <span>Giảm giá</span>
                  <span className="text-green-600 font-semibold">
                    -{order.discount_amount?.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span className="text-blue-600 font-semibold">
                    +{order.shipping_fee?.toLocaleString()}₫
                  </span>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng thanh toán</span>
                  <span className="text-red-500 text-lg">{order.total?.toLocaleString()}₫</span>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <DollarOutlined />
                    <span className="font-semibold">Phương thức thanh toán:</span>
                  </span>
                  <Tag
                    color="blue"
                    className="font-semibold"
                    style={{ textTransform: "capitalize" }}
                  >
                    {order.payment_method?.toUpperCase() || "-"}
                  </Tag>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <ReloadOutlined />
                    <span className="font-semibold">Trạng thái thanh toán:</span>
                  </span>
                  <Tag
                    color={order.payment_status === "paid" ? "green" : "orange"}
                    className="font-semibold"
                    style={{ textTransform: "capitalize" }}
                  >
                    {order.payment_status.toUpperCase()}
                  </Tag>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 mt-8">
              <Button
                type="primary"
                size="large"
                className="w-full font-bold rounded-lg border-2 border-gray-300 text-gray-700"
                onClick={() => navigate("/admin/listorder")}
              >
                Quay lại danh sách đơn hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailOrder;