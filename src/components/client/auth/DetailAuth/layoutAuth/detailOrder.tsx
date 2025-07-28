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
    pending: { text: "Pending", color: "orange" },
    confirmed: { text: "Confirmed", color: "geekblue" },
    processing: { text: "Processing", color: "cyan" },
    shipping: { text: "Shipping", color: "purple" },
    delivered: { text: "Delivered", color: "blue" },
    completed: { text: "Completed", color: "green" },
    cancelled: { text: "Cancelled", color: "red" },
    returned: { text: "Returned", color: "volcano" },
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
                <Title level={3} className="text-blue-600">🧾 Order Details</Title>

                {/* Shipping and Order Information */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card title="Shipping Information" bordered={false} className="shadow rounded-lg min-h-[246px]">
                            <p><UserOutlined /> <strong>Recipient:</strong> <span className="float-right">{order.address?.recipient || "-"}</span></p>
                            <p className="mt-2"><PhoneOutlined /> <strong>Phone:</strong> <span className="float-right">{order.shipping_address?.phone || "-"}</span></p>
                            <p className="mt-2"><HomeOutlined /> <strong>Address:</strong> <span className="float-right">{order.address?.address}</span></p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Order Information" bordered={false} className="shadow rounded-lg">
                            <p><TagOutlined /> <strong>Order ID:</strong> <span className="float-right">{order._id}</span></p>
                            <p className="mt-2"><SyncOutlined /> <strong>Status:</strong>
                                <Tag color={getStatusInfo(order.status).color} className="float-right">{getStatusInfo(order.status).text}</Tag>
                            </p>
                            <p className="mt-2"><DollarOutlined /> <strong>Payment Method:</strong> <span className="float-right">{order.payment_method || "-"}</span></p>
                            <p className="mt-2"><FileTextOutlined /> <strong>Note:</strong> <span className="float-right">{order.note || "-"}</span></p>
                            <p className="mt-2"><ClockCircleOutlined /> <strong>Order Date:</strong> <span className="float-right">{new Date(order.created_at).toLocaleString()}</span></p>
                        </Card>
                    </Col>
                </Row>

                {/* Product List */}
                <Card title="🛍️ Products in Order" bordered={false} className="shadow rounded-lg">
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
                                                <Text strong>{item?.product.name}</Text>
                                                <span className="ml-2 text-gray-500">x{item.quantity}</span>
                                                {item.selected_variant?.color?.name && (
                                                    <p className="text-sm">Color: <strong>{item.selected_variant.color.name}</strong></p>
                                                )}
                                            </div>
                                            <Text className="text-red-500 font-semibold">
                                                {item.total_price?.toLocaleString()}₫
                                            </Text>
                                        </div>
                                    }
                                    description={<Text>Unit price: {item.unit_price.toLocaleString()}₫</Text>}
                                />
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <div className="text-right text-base flex flex-col gap-1">
                        <p>Subtotal: <strong>{order.subtotal.toLocaleString()}₫</strong></p>
                        {order.shipping_fee > 0 && (
                            <div>
                                <Text>
                                    Shipping Fee:{" "}
                                    <strong style={{ color: "black" }}>
                                        {Number(order.shipping_fee).toLocaleString("vi-VN")}₫
                                    </strong>
                                </Text>
                            </div>
                        )}
                        <p>Discount: <strong className="text-green-600">- {order.discount_amount.toLocaleString()}₫</strong></p>

                        <p className="text-lg font-bold text-blue-600">Total: {order.total.toLocaleString()}₫</p>
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
                                    <Text strong className="text-gray-800 text-base">Your return request is being processed. Please await a response!</Text>
                                    <div className="mt-1">
                                        <Text strong>Reason for return:</Text>{" "}
                                        <Text type="danger">
                                            {
                                                order.timeline
                                                    ?.filter((t: any) => t.status === "delivered" && t.note?.trim())
                                                    .pop()?.note || "No specific reason provided"
                                            }
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
                {/* Order History */}
                <Card title="📍 Order Update History" bordered={false} className="shadow rounded-lg">
                  {order.timeline.map((item: any, index: number) => {
                      const status = getStatusInfo(item.status);
                      const time = new Date(item.changedAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                      });
                      const date = new Date(item.changedAt).toLocaleDateString("vi-VN");

                      return (
                          <div key={index} className=" rounded-md p-4 mb-4 shadow-sm bg-white">
                              <Tag color={status.color} className="text-[13px] font-semibold">{status.text.toUpperCase()}</Tag>
                              <p className="mt-1 text-[14px] text-gray-700">
                                  <strong>Time:</strong> {time} {date}
                              </p>
                              <p className="mt-1 text-[14px] text-gray-700">
                                  <strong>Note:</strong> {item.note || <span className="italic text-gray-400">No note provided.</span>}
                              </p>
                          </div>
                      );
                  })}
              </Card>
            </div>
        </div>
    );
};

export default DetailOrderClient;