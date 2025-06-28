import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { useOneData } from "../../../hooks/useOne";
import { useUpdate } from "../../../hooks/useUpdate";

const { Title } = Typography;

const EditUser = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const { data: user } = useOneData({
        resource: "/users",
        _id: id,
    });

    useEffect(() => {
        if (!user) return;
        form.setFieldsValue({
        name: user.data.name,
        email: user.data.email,
        role: user.data.role,
        });
    }, [user, form]);

    const { mutate } = useUpdate({
        resource: "/users",
        _id: id,
    });

    const handleFinish = (values: any) => {
        setLoading(true);
        mutate(values, {
            onSuccess: () => {
                navigate("/admin/listUsers");
            },
            onError: () => {
                message.error("Update failed");
            },
            onSettled: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="w-full flex justify-center mt-10">
            <Card className="w-full max-w-md mx-auto mt-16 shadow-xl rounded-2xl px-8 py-10 bg-white">
                <div className="flex items-center justify-center mb-6">
                    <EditOutlined className="text-2xl mr-2 text-blue-500" />
                    <Title level={3} className="!mb-0 text-center">
                    Update User
                    </Title>
                </div>

                <Form layout="vertical" form={form} onFinish={handleFinish}>
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter name" }]}
                    >
                        <Input size="large" placeholder="Enter full name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Invalid email format" },
                        ]}
                    >
                        <Input size="large" placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: "Please select role" }]}
                        >
                        <Select size="large" placeholder="Select role">
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item className="pt-4">
                        <div className="flex justify-between">
                            <Button htmlType="reset" size="large">
                                Reset
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                            >
                                Update
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditUser;
