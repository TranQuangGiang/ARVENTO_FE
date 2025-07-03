import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, List, Image, Tag, Spin, Typography, Divider, Row, Col, Button } from "antd";
import { motion } from "framer-motion";
import { useOneDataOrder } from "../../../hooks/useOnedataOrder";
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
} from "@ant-design/icons";

const { Title, Text } = Typography;

const statusColors: Record<string, string> = {
  pending: "#faad14",
  confirmed: "#1677ff",
  processing: "#13c2c2",
  shipping: "#722ed1",
  delivered: "#2f54eb",
  completed: "#52c41a",
  cancelled: "#ff4d4f",
  returned: "#d46b08",
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-10 bg-gray-50 min-h-screen"
    >
      <Card
        bordered={false}
        className="shadow-lg rounded-xl"
        style={{ maxWidth: 1100, margin: "0 auto" }}
      >
        <Title level={3} className="text-center mb-6">Order Details</Title>
        <Divider />

        <Row gutter={24} className="mb-6">
          <Col xs={24} md={12}>
            <Title level={4}>Shipping Info</Title>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p>
                <UserOutlined className="mr-1" />
                <strong>Recipient:</strong>
                <span style={{ float: "right" }}>{order.address?.recipient || "-"}</span>
              </p>
              <p>
                <PhoneOutlined className="mr-1" />
                <strong>Phone:</strong>
                <span style={{ float: "right" }}>{order.address?.phone || "-"}</span>
              </p>
              <p>
                <HomeOutlined className="mr-1" />
                <strong>Address:</strong>
                <span style={{ float: "right" }}>
                  {order.address?.address}, {order.address?.ward}, {order.address?.district}, {order.address?.city}
                </span>
              </p>
            </div>
          </Col>
         <Col xs={24} md={12}>
  <Title level={4}>Order Info</Title>
  <div className="bg-gray-100 p-4 rounded-lg">
    <p>
      <TagOutlined className="mr-1" />
      <strong>Order ID:</strong>
      <span style={{ float: "right" }}>{order._id}</span>
    </p>
    <p>
      <SyncOutlined className="mr-1" />
      <strong>Status:</strong>
      <span style={{ float: "right" }}>
        <Tag color={statusColors[order.status] || "blue"}>
          <strong style={{ fontWeight: 500 }}>{order.status.toUpperCase()}</strong>
        </Tag>
      </span>
    </p>
    <p className="mt-1">
      <DollarOutlined className="mr-1" />
      <strong>Payment Status:</strong>
      <span style={{ float: "right" }}>
        <Tag color={order.payment_status === "paid" ? "green" : "orange"}>
          <strong style={{ fontWeight: 500 }}>{order.payment_status?.toUpperCase()}</strong>
        </Tag>
      </span>
    </p>
    <p className="mt-1">
      <DollarOutlined className="mr-1" />
      <strong>Payment Method:</strong>
      <span style={{ float: "right"}}>
        {order.payment_method ? order.payment_method.toUpperCase() : "-"}
      </span>
    </p>
    <p>
      <FileTextOutlined className="mr-1" />
      <strong>Note:</strong>
      <span style={{ float: "right" }}>{order.note || "-"}</span>
    </p>
    <p>
      <ClockCircleOutlined className="mr-1" />
      <strong>Created At:</strong>
      <span style={{ float: "right" }}>{new Date(order.created_at).toLocaleString()}</span>
    </p>
    <p>
      <ReloadOutlined className="mr-1" />
      <strong>Last Updated:</strong>
      <span style={{ float: "right" }}>{new Date(order.updated_at).toLocaleString()}</span>
    </p>
  </div>
</Col>

        </Row>

        <Divider />

        <Title level={4} className="mb-3">Product List</Title>
        <Card bordered={false} className="bg-gray-50">
          <List
            dataSource={order.items}
            renderItem={(item: any) => {
              const totalItemPrice = item.price * item.quantity;
              return (
                <List.Item key={item.product._id}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={60}
                        src={item.selected_variant?.image?.url || item.product.images[0]?.url}
                        alt={item.selected_variant?.image?.alt || item.product.images[0]?.alt}
                        className="rounded-lg"
                      />
                    }
                    title={
                      <>
                        <Text strong>{item.product.name}</Text>
                        <Text className="ml-2" type="secondary">x{item.quantity}</Text>
                        <Text style={{ marginLeft: 12, color: "red", fontWeight: 500 }}>
                          {totalItemPrice.toLocaleString()}₫
                        </Text>
                        {item.selected_variant?.color?.name && (
                          <Text
                            style={{
                              display: "block",
                              marginTop: 2,
                              
                            }}
                          >
                            Color: <strong> {item.selected_variant.color.name}</strong>
                          </Text>
                        )}
                      </>
                    }
                    description={
                      <div>
                        <Text>Price: <strong>{item.price?.toLocaleString()}₫</strong></Text>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
          <Divider />
          <div className="text-right pr-4">
            <Text strong style={{ fontSize: 18 }}>
              Order Total: <span className="text-green-600">{order.total?.toLocaleString()}₫</span>
            </Text>
          </div>
        </Card>

        {order.timeline && order.timeline.length > 0 && (
          <>
            <Divider className="my-6" />
            <Title level={4} className="mb-3">Status Timeline</Title>
            <Card bordered={false} className="bg-gray-50">
              <List
                dataSource={order.timeline}
                renderItem={(item :any, index) => (
                  <List.Item key={index}>
                    <List.Item.Meta
                      title={
                        <Tag color={statusColors[item.status] || "blue"}>
                          <strong style={{ fontWeight: 500 }}>{item.status.toUpperCase()}</strong>
                        </Tag>
                      }
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
          </>
        )}
        <div className="text-right mt-5">
            <Button onClick={() => navigate(`/admin/listorder`)}>
              Cancel
            </Button>
          </div>
      </Card>
    </motion.div>
  );
};

export default DetailOrder;
