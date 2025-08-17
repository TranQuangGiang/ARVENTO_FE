import React from "react";
import { Button, Card, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const EmailVerificationNotice = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5"
    }}>
      <Card
        style={{
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <MailOutlined style={{ fontSize: 48, color: "#1890ff" }} />
        <Title level={3} style={{ marginTop: 16 }}>Xác minh Email</Title>
        <Paragraph>
          Chúng tôi đã gửi liên kết xác minh đến địa chỉ email của bạn. 
          Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết để hoàn tất đăng ký.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => window.open("https://mail.google.com", "_blank")}
        >
          Mở Email của tôi
        </Button>
        <Paragraph style={{ marginTop: 24 }}>
          Không nhận được email ?{" "}
          <a onClick={() => navigate("/resend-verification")}>
            Gửi lại liên kết xác minh
          </a>
        </Paragraph>
      </Card>
    </div>
  );
};

export default EmailVerificationNotice;
