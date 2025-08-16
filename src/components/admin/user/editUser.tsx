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

const { Title, Text } = Typography;

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
    <div className="min-h-screen flex justify-center items-start mt-10 bg-gray-50">
      <Card
        className="w-full max-w-6xl shadow-xl rounded-2xl border-none bg-white"
        bodyStyle={{ padding: 32 }}
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-2">
            <EditOutlined className="text-blue-500 text-2xl mr-2" />
            <Title level={3} className="!mb-0">Cập nhập người dùng</Title>
          </div>
          <Text type="secondary">Chỉnh sửa thông tin người dùng và cập nhật vai trò của họ</Text>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleFinish}
          className="space-y-4"
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input
              placeholder="Enter full name"
              className="rounded h-[40px]"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
                style={{height: 40}}
              readOnly
              className="cursor-not-allowed rounded text-[15px] text-gray-500 bg-gray-100"
              placeholder="Enter email"
            />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select style={{height: 40}} className="rounded text-[15px]" placeholder="Select role">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="pt-6">
            <div className="flex justify-between">
              <Button htmlType="reset" size="large">
                Đặt lại
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                Cập nhập
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditUser;
