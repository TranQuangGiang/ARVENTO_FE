import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card, List, Image, Tag, Spin, Typography, Divider, Row, Col, Button,
  message,
} from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined, PhoneOutlined, HomeOutlined, TagOutlined,
  SyncOutlined, FileTextOutlined, ClockCircleOutlined,
  ReloadOutlined, DollarOutlined
} from "@ant-design/icons";
import { useOneDataOrder } from "../../../hooks/useOnedataOrder";
import axiosInstance from "../../../utils/axiosInstance";

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
  const [loading, setLoading] = useState(false);

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
        <Title level={3} className="text-center">Order Details</Title>

        {/* Shipping & Order Info */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Shipping Information" bordered={false} className="custom-card-title rounded-lg flex flex-col min-h-[283px] shadow-md">
              <p className="mt-0"><UserOutlined /> <strong>Recipient:</strong> <span className="float-right">{order.address?.recipient || "-"}</span></p>
              <p className="mt-1"><PhoneOutlined /> <strong>Phone:</strong> <span className="float-right">{order.shipping_address?.phone || "-"}</span></p>
              <p className="mt-1"><HomeOutlined /> <strong>Address:</strong> <span className="float-right">{order.address?.address}</span></p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Order Information" bordered={false} className="custom-card-title rounded-lg flex flex-col min-h-[257px] shadow-md">
              <p className="mt-0"><TagOutlined /> <strong>Order ID:</strong> <span className="float-right">{order._id}</span></p>
              <p className="mt-1"><SyncOutlined /> <strong>Status:</strong>
                <Tag color={statusColors[order.status]} className="float-right">{order.status.toUpperCase()}</Tag>
              </p>
              <p className="mt-1"><DollarOutlined /> <strong>Payment:</strong>
                <Tag color={order.payment_status === "paid" ? "green" : "orange"} className="float-right">{order.payment_status.toUpperCase()}</Tag>
              </p>
              <p className="mt-1"><DollarOutlined /> <strong>Payment Method:</strong> <span className="float-right">{order.payment_method?.toUpperCase() || "-"}</span></p>
              <p className="mt-1"><FileTextOutlined /> <strong>Note:</strong> <span className="float-right">{order.note || "-"}</span></p>
              <p className="mt-1"><ClockCircleOutlined /> <strong>Created At:</strong> <span className="float-right">{new Date(order.created_at).toLocaleString()}</span></p>
              <p className="mt-1"><ReloadOutlined /> <strong>Last Updated:</strong> <span className="float-right">{new Date(order.updated_at).toLocaleString()}</span></p>
            </Card>
          </Col>
        </Row>

        {/* Product List */}
        <Card title="Products in Order" bordered={false} className="custom-card-title rounded-lg flex flex-col shadow-md">
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
                        <Text strong>{item.product?.name}</Text>
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
                  description={<Text>Unit Price: {item?.unit_price.toLocaleString()}₫</Text>}
                />
              </List.Item>
            )}
          />
          <Divider />
          <div className="text-right space-y-2">
            <Text>
              Coupon Code: <strong>{order.applied_coupon?.code || "-"}</strong>
            </Text>
            <br />
            <Text>
              Discount: <span className="text-green-600">-{order.discount_amount?.toLocaleString()}₫</span>
            </Text>
            <br />
            <Text>
              Shipping Fee: <span className="text-blue-600">{order.shipping_fee?.toLocaleString()}₫</span>
            </Text>
            <br />
            <Text strong style={{ fontSize: 18 }}>
              Total Amount: <span className="text-red-500">{order.total?.toLocaleString()}₫</span>
            </Text>
          </div>
        </Card>

        {/* Return Request */}
        {order.status === "delivered" && order.is_return_requested && (
          <Card
            bordered={false}
            className="rounded-lg shadow-sm bg-yellow-50 border border-yellow-200"
            style={{ borderLeft: "3px solid #faad14" }}
          >
            <div className="flex items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl mt-1">⚠️</span>
                <div>
                  <Text strong className="text-gray-800 text-base">Return Request</Text>
                  <div className="mt-1">
                    <Text strong>Reason:</Text>{" "}
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

              <Button
                type="primary"
                danger
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const token = localStorage.getItem("token");
                    await axiosInstance.patch(`/orders/${order._id}/status`,
                      {
                        status: "returning",
                        note: "Return request approved"
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.success("Return request approved");
                    refetch();
                  } catch (err) {
                    message.error("Failed to process request!");
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Approve Return Request
              </Button>
            </div>
          </Card>
        )}

        {/* Status Timeline */}
        {order.timeline && order.timeline.length > 0 && (
          <Card title="Status History" bordered={false} className="shadow rounded-lg">
            <List
              dataSource={order.timeline}
              renderItem={(item: any, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={<Tag color={statusColors[item.status]}>{item.status.toUpperCase()}</Tag>}
                    description={
                      <>
                        <Text>Time: {new Date(item.changedAt).toLocaleString()}</Text><br />
                        <Text>Note: {item.note || "-"}</Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Back Button */}
        <div className="text-right mt-4">
          
          <Button type="default" onClick={() => navigate("/admin/listorder")}>Back to Order List</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailOrder;
