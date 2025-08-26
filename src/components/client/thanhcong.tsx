import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, List, Image, Typography, Divider, Row, Col, Button, Tag } from "antd"; // ✅ Thêm Tag
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
  MailOutlined, // ✅ Thêm icon email
  CheckCircleOutlined, // ✅ Thêm icon thành công
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

  // Hàm để lấy thẻ tag trạng thái
  const getStatusTag = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Tag color="orange" className="font-semibold">PENDING</Tag>;
      case "SHIPPED":
        return <Tag color="blue" className="font-semibold">SHIPPED</Tag>;
      case "DELIVERED":
        return <Tag color="green" className="font-semibold">DELIVERED</Tag>;
      case "CANCELLED":
        return <Tag color="red" className="font-semibold">CANCELLED</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const paymentMethodText = (method: string) => {
    switch (method) {
      case "COD":
        return "COD";
      case "MOMO":
        return "MOMO";
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 py-10 bg-gray-50 min-h-screen mb-6"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Dòng "Đơn hàng đã được đặt thành công!" */}
        <Card
          bordered={false}
          className="shadow-lg rounded-xl mb-6"
        >
          <div className="flex justify-center items-center mb-4 flex-col text-center">
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
              <CheckCircleOutlined style={{ marginRight: 8 }} />
              Đơn hàng đã được đặt thành công!
            </Title>
            <Text type="secondary">Mã đơn hàng của bạn là: <strong className="text-blue-500">{order._id}</strong></Text>
          </div>
        </Card>

        {/* Bố cục chính với 2 cột */}
        <Row gutter={[24, 24]}>
          {/* Cột chính chứa thông tin khách hàng và sản phẩm */}
          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              {/* Thông tin khách hàng */}
              <div className="mt-7 w-full flex items-center mb-7">
                <Col xs={24} md={12}>
                  <Card bordered={false} className="shadow-lg rounded-xl h-[205px]">
                    <Title level={5}>Thông tin khách hàng</Title>
                    <Divider className="!my-2" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserOutlined />
                        <Text>{order.customer?.name || "Trần Quang Giang"}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneOutlined />
                        <Text>{order.address?.phone || "0348892533"}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <MailOutlined />
                        <Text>{order.customer?.email || "giangtqph52177@gmail.com"}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
                {/* Thông tin giao hàng */}
              <Col xs={24} md={12}>
                <Card bordered={false} className="shadow-lg rounded-xl">
                  <Title level={5}>Thông tin người nhận</Title>
                  <Divider className="!my-2" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UserOutlined />
                      <Text>{order.address?.recipient || "Trần Quang Giang"}</Text>
                    </div>
                    <div className="flex items-start gap-2">
                      <PhoneOutlined className="mt-1"/>
                      <Text>{order.shipping_address?.phone}</Text>
                    </div>
                    <div className="flex items-start gap-2">
                      <HomeOutlined className="mt-1"/>
                      <Text>{order.address?.address}</Text>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileTextOutlined className="mt-1" />
                      <Text>{order.note || "No notes"}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              </div>
              
              
            </Row>

            {/* Danh sách sản phẩm */}
            <Card bordered={false} className="shadow-lg rounded-xl mt-6">
              <Title level={5}>Sản phẩm theo đơn hàng</Title>
              <Divider className="!my-2" />
              <List
                itemLayout="horizontal"
                dataSource={order.items}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Image src={item.selected_variant?.image?.url || "/no-image.png"} width={60} />}
                      title={`${item.product?.name || "Tên sản phẩm"} ${item.selected_variant?.size ? ` - ${item.selected_variant.size}` : ''}`}
                      description={
                        <div>
                          <Text>Qty: {item.quantity}</Text> | <Text>Màu: {item.selected_variant?.color?.name}</Text>
                          <br />
                          <Text>Đơn giá: {item.price?.toLocaleString()}₫</Text>
                        </div>
                      }
                    />
                    <div>
                      <Text strong>{item.total_price?.toLocaleString()}₫</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* Cột tóm tắt thanh toán */}
          <Col xs={24} lg={8}>
            <div className="mt-7">
                <Card bordered={false} className="shadow-lg rounded-xl mt-7">
                <Title level={5}>Tóm tắt thanh toán</Title>
                <Divider className="!my-2" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text>Tạm tính</Text>
                    <Text>{order.subtotal?.toLocaleString()}₫</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Giảm giá</Text>
                    <Text type="success">-{order.applied_coupon?.discount_amount?.toLocaleString()}₫</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>Phí vận chuyển</Text>
                    <Text type="secondary">+<span className="text-blue-500 font-semibold">{order.shipping_fee?.toLocaleString()}₫</span></Text>
                  </div>
                  <Divider className="!my-2" />
                  <div className="flex justify-between items-center">
                    <Text strong style={{fontSize: 18}}>Tổng thanh toán</Text>
                    <Text strong style={{color: "red", fontSize: 18}} className="text-red-500 text-lg">
                      {order.total?.toLocaleString()}₫
                    </Text>
                  </div>
                </div>
                <Divider className="!my-2" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Text><DollarOutlined className="mr-1" />Phương thức thanh toán:</Text>
                    <Tag color="blue">{paymentMethodText(order.payment_method)}</Tag>
                  </div>
                  <div className="flex justify-between items-center">
                    <Text><ClockCircleOutlined className="mr-1" />Trạng thái thanh toán:</Text>
                    {getStatusTag(order.status)}
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="mt-4">
              <Button type="default" block onClick={() => navigate("/")}>
                Về trang chủ
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </motion.div>
  );
};

export default Thanhcong;