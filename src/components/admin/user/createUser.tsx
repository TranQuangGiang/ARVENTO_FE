import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Tag,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreate } from "../../../hooks/useCreate";
import { EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const CreateUser = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { mutate } = useCreate({ resource: "/users" });

  const handleFinish = (values: any) => {
    setLoading(true);
    mutate(values, {
      onSuccess: () => {
        navigate("/admin/listVendors");
      },
      onError: () => {
        message.error("Create failed");
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="w-full flex justify-center mt-10">
      <Card className="w-full max-w-6xl shadow-lg rounded-2xl">
        <div className="flex items-center justify-center mb-6">
          <EditOutlined className="text-2xl mr-2 text-blue-500" />
          <Title level={3} className="!mb-0">
            Create User
          </Title>
        </div>

        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input className="h-[40px]" placeholder="Enter user's full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input className="h-[40px]" placeholder="Enter user's email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input className="h-[40px]" placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password className="h-[40px]" placeholder="Enter password" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Province (Tỉnh)"
                name={["address", 0, "province"]}
                rules={[{ required: true, message: "Please enter province" }]}
              >
                <Input className="h-[40px]" placeholder="Province" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="District (Quận/Huyện)"
                name={["address", 0, "district"]}
                rules={[{ required: true, message: "Please enter district" }]}
              >
                <Input className="h-[40px]" placeholder="District" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ward (Phường/Xã)"
                name={["address", 0, "ward"]}
                rules={[{ required: true, message: "Please enter ward" }]}
              >
                <Input className="h-[40px]" placeholder="Ward" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Detail Address"
                name={["address", 0, "detail"]}
                rules={[{ required: true, message: "Please enter detailed address" }]}
              >
                <Input className="h-[40px]" placeholder="e.g. 123 Street Name, Apartment..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Address Phone"
                name={["address", 0, "phone"]}
                rules={[{ required: true, message: "Please enter phone for address" }]}
              >
                <Input className="h-[40px]" placeholder="Phone for address" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select role" }]}
          >
            <Select style={{ height: 40 }} placeholder="Select a role">
              <Select.Option value="user">
                <Tag color="blue">User</Tag>
              </Select.Option>
              <Select.Option value="admin">
                <Tag color="gold">Admin</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="pt-4">
            <div className="flex justify-end gap-4">
              <Button htmlType="reset" style={{ height: 40 }}>
                Reset
              </Button>
              <Button
                className="w-44"
                style={{ height: 40 }}
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;