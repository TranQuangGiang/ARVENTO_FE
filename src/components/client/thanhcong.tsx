import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, List, Image, Typography, Divider, Row, Col, Button } from "antd"; // ✅ Thêm Button
import { motion } from "framer-motion";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  TagOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const Thanhcong = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  console.log("Order data:", order);

  if (!order) {
    navigate("/");
    return null;
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
        <div className="flex justify-center items-center mb-4 flex-col">
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            style={{ width: 80, marginBottom: 8 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          />
          <Title level={4} style={{ color: "green", margin: 0 }}>
            Đơn hàng đã được đặt thành công!
          </Title>
        </div>

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
                  {order.address?.address || "-"}
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
              <p className="mt-1">
                <DollarOutlined className="mr-1" />
                <strong>Payment Method:</strong>
                <span style={{ float: "right" }}>
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
              return (
                <List.Item key={item.product._id}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={60}
                        src={item.selected_variant?.image?.url || "/no-image.png"}
                        alt={item.selected_variant?.image?.alt || "Product image"}
                        className="rounded-lg"
                      />
                    }
                    title={
                      <>
                        <Text strong>{item.product?.name || "Tên sản phẩm"}</Text>
                        <Text className="ml-2" type="secondary">x{item.quantity}</Text>
                        <Text style={{ marginLeft: 12, color: "red", fontWeight: 500 }}>
                          {item.total_price?.toLocaleString()}₫
                        </Text>
                        {item.selected_variant?.color?.name && (
                          <Text style={{ display: "block", marginTop: 2 }}>
                            Color: <strong>{item.selected_variant.color.name}</strong>
                          </Text>
                        )}
                        {item.selected_variant?.size && (
                          <Text style={{ display: "block" }}>
                            Size: <strong>{item.selected_variant.size}</strong>
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
          <div className="text-right pr-4 mb-4">
            <Text strong style={{ fontSize: 18 }}>
              Order Total: <span className="text-green-600">{order.total?.toLocaleString()}₫</span>
            </Text>
          </div>
        </Card>
        <div className="text-right mt-5">
            <Button onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
      </Card>
    </motion.div>
  );
};

export default Thanhcong;
