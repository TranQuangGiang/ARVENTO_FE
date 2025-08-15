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
        <Title level={3} style={{ marginTop: 16 }}>Email Verification</Title>
        <Paragraph>
          We have sent a verification link to your email address.
          Please check your inbox and click the link to complete your registration.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => window.open("https://mail.google.com", "_blank")}
        >
          Open my Email
        </Button>
        <Paragraph style={{ marginTop: 24 }}>
          Didn't receive the email?{" "}
          <a onClick={() => navigate("/resend-verification")}>
            Resend verification link
          </a>
        </Paragraph>
      </Card>
    </div>
  );
};

export default EmailVerificationNotice;
