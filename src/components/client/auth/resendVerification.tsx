import React, { useState } from "react";
import { Card, Typography, Input, Button, Form, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const ResendVerification = () => {
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            await axios.post("http://localhost:3000/api/auth/resend-verify-email", {
                email: values.email,
            });

            message.success("Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư của bạn.");
            nav('/verifyEmail')
        } catch (error: any) {
            const msg =
                error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
                
            }}
        >
            <Card
                bordered={false}
                style={{
                    maxWidth: 420,
                    width: "100%",
                    borderRadius: 16,
                    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.1)",
                    background: "#fff",
                    padding: 32,
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                        style={{
                            backgroundColor: "#e6f7ff",
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                        }}
                    >
                        <MailOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                    </div>
                    <Title level={3} style={{ marginTop: 16 }}>
                        Gửi lại email xác minh
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: 14 }}>
                        Nhập email bạn đã dùng để đăng ký tài khoản.
                        Chúng tôi sẽ gửi lại liên kết xác minh nếu email chưa được xác minh.
                    </Paragraph>
                </div>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        label={<Text strong>Email của bạn</Text>}
                        rules={[
                            { required: true, message: "Vui lòng nhập email của bạn" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                       Gửi lại liên kết xác minh
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResendVerification;
