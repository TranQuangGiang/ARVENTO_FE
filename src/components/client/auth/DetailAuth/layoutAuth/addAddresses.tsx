import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const AddAddresses = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log("Địa chỉ mới:", values);
    // gửi dữ liệu tại đây
  };

    return (
        <div className="flex w-full justify-center ">
            <Card
                className="w-full max-w-[1017px] shadow-md border border-gray-200 rounded-xl bg-white"
                bodyStyle={{ padding: "32px 40px" }}
            >
                <div className="text-center mb-6">
                    <Title level={3}>
                        <HomeOutlined className="mr-2 text-blue-500" />
                        Thêm địa chỉ mới
                    </Title>
                </div>

                <Form
                    layout="vertical"
                    form={form}
                    onFinish={handleFinish}
                    autoComplete="off"
                    className="w-full"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            ]}
                        >
                            <Input
                            size="large"
                            prefix={<PhoneOutlined />}
                            placeholder="Nhập số điện thoại"
                            className="rounded-lg"
                            />
                        </Form.Item>
                        </Col>
                        <Col span={12}>
                        <Form.Item
                            label="Tỉnh / Thành phố"
                            name="province"
                            rules={[
                            { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
                            ]}
                        >
                            <Input
                            size="large"
                            prefix={<EnvironmentOutlined />}
                            placeholder="Nhập tỉnh hoặc thành phố"
                            className="rounded-lg"
                            />
                        </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Quận / Huyện"
                                name="district"
                                rules={[
                                    { required: true, message: "Vui lòng nhập quận/huyện" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập quận hoặc huyện"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Phường / Xã"
                                name="ward"
                                rules={[
                                    { required: true, message: "Vui lòng nhập phường/xã" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    placeholder="Nhập phường hoặc xã"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Địa chỉ chi tiết"
                        name="detail"
                        rules={[
                            { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            size="large"
                            placeholder="VD: 123 Lê Văn Sỹ, hẻm 20, gần chợ XYZ"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button htmlType="reset" size="large">
                            Đặt lại
                        </Button>
                        <Button type="primary" htmlType="submit" size="large" className="w-40">
                            Thêm địa chỉ
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AddAddresses;
