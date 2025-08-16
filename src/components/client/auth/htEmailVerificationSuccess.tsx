import React, { useEffect, useState } from 'react';
import { Result, Button, Card, Typography, message } from 'antd';
import { MailTwoTone  } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pointer } from 'lucide-react';


const { Paragraph } = Typography;

const EmailVerificationSuccess = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerifyEmail = async () => {
        const token = localStorage.getItem("token");
        if (!token) return message.error('Token not found');

        setLoading(true);
        try {
            await axios.get(`http://localhost:3000/api/auth/verify-email?token=${token}`);
            message.success("Xác thực email thành công");
            setIsVerified(true);
        } catch (error: any) {
            message.error(error?.message || "Email verification failed");
            setIsVerified(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 500,
                    textAlign: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: 8,
                    padding: '2rem'
                }}
                bordered={false}
            >
                {!isVerified ? (
                    <>
                        <MailTwoTone twoToneColor="#1890ff" style={{ fontSize: 64 }} />
                        <Typography.Title level={3} style={{ marginTop: 20 }}>
                            Xác minh địa chỉ email của bạn
                        </Typography.Title>
                        <Paragraph>
                            Nhấp vào nút bên dưới để xác minh email và kích hoạt tài khoản của bạn.
                        </Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleVerifyEmail}
                            loading={loading}
                            style={{ marginTop: 20, borderRadius: 8 }}
                        >
                            <Pointer className="hand-motion" />  Xác minh Email
                        </Button>
                    </>
                ) : (
                    <>
                        <Result
                            icon={<MailTwoTone twoToneColor="#52c41a" style={{ fontSize: '4rem' }} />}
                            title="Xác thực email thành công"
                            subTitle="Tài khoản của bạn đã được xác minh thành công. Bây giờ bạn có thể đăng nhập và bắt đầu khám phá các tính năng của chúng tôi."
                            extra={[
                                
                                <Link to={`/`} key="home">
                                    <Button>
                                        Quay lại trang chủ
                                    </Button>
                                </Link>
                            ]}
                        />
                        <Paragraph type="secondary" style={{ marginTop: '2rem', fontSize: '12px' }}>
                            Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ với nhóm hỗ trợ của chúng tôi.
                        </Paragraph>
                    </>
                )}
            </Card>
        </div>
    );
};

export default EmailVerificationSuccess;
