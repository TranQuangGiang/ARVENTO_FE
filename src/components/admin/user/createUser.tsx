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
import { UserAddOutlined } from "@ant-design/icons"; // Biểu tượng thêm người dùng

const { Title } = Typography;
const { Option } = Select;

const CreateUser = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { mutate } = useCreate({ resource: "/users" });

  const handleFinish = (values:any) => {
    setLoading(true);
    mutate(values, {
      onSuccess: () => {
        navigate("/admin/listUsers"); 
      },
      onError: (error) => {
        console.error("Lỗi khi thêm người dùng:", error);
        message.error("Thêm mới thất bại. Vui lòng thử lại.");
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="pl-6 pr-6 mt-10 bg-gray-50 min-h-screen">
      <Card className="w-full shadow-lg rounded-2xl">
        <div className="flex items-center justify-center mb-6">
          <UserAddOutlined className="text-2xl mr-2 text-blue-500" />
          <Title level={3} className="!mb-0">
            Thêm mới người dùng
          </Title>
        </div>

        <Form 
          layout="vertical" 
          form={form} 
          onFinish={handleFinish}
        >
          {/* Hàng 1: Tên và Email */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input className="h-[40px]" placeholder="Nhập họ tên người dùng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Địa chỉ email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Định dạng email không hợp lệ" },
                ]}
              >
                <Input className="h-[40px]" placeholder="Nhập email người dùng" />
              </Form.Item>
            </Col>
          </Row>

          {/* Hàng 2: Số điện thoại và Mật khẩu */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input className="h-[40px]" placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Vui lòng nhập tối thiểu 6 ký tự"}
                ]}
              >
                <Input.Password style={{height: 40}} />
              </Form.Item>
            </Col>
          </Row>

          {/* Hàng 3: Vai trò */}
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select style={{ height: 40 }} placeholder="Chọn vai trò">
              <Option value="user">
                <Tag color="blue">User</Tag>
              </Option>
              <Option value="admin">
                <Tag color="gold">Admin</Tag>
              </Option>
            </Select>
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item className="pt-4">
            <div className="flex justify-end gap-4">
              <Button htmlType="reset" style={{ height: 40 }}>
                Hủy
              </Button>
              <Button
                className="w-44"
                style={{ height: 40 }}
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Thêm mới
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUser;