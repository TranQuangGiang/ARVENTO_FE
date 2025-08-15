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
            message.success("Email verification successful!");
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
                            Verify your email address
                        </Typography.Title>
                        <Paragraph>
                            Click the button below to verify your email and activate your account.
                        </Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleVerifyEmail}
                            loading={loading}
                            style={{ marginTop: 20, borderRadius: 8 }}
                        >
                            <Pointer className="hand-motion" />  Verify Email
                        </Button>
                    </>
                ) : (
                    <>
                        <Result
                            icon={<MailTwoTone twoToneColor="#52c41a" style={{ fontSize: '4rem' }} />}
                            title="Email verified successfully!"
                            subTitle="Your account has been successfully verified. You can now log in and start exploring our features."
                            extra={[
                                <Button type="primary" key="login">
                                    Log In Now
                                </Button>,
                                <Link to={`/`} key="home">
                                    <Button>
                                        Back to Home
                                    </Button>
                                </Link>
                            ]}
                        />
                        <Paragraph type="secondary" style={{ marginTop: '2rem', fontSize: '12px' }}>
                            If you encounter any issues, please contact our support team.
                        </Paragraph>
                    </>
                )}
            </Card>
        </div>
    );
};

export default EmailVerificationSuccess;
