import React, { useEffect, useState } from "react";
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
  PlusOutlined,
} from "@ant-design/icons";
import { useCreate } from "../../../../../hooks/useCreate";
import { useNavigate, useParams } from "react-router-dom";
import { useOne } from "../../../../../providers/data/dataProviders";
import { useOneData } from "../../../../../hooks/useOne";
import { useUpdate } from "../../../../../hooks/useUpdate";

const { Title } = Typography;

const UpdateAddresses = () => {
    const [form] = Form.useForm();
    const [ selected,setSelected ] = useState('');
    const nav = useNavigate();

    const { id } = useParams();
    const { data:addresses } = useOneData({
        resource: `/addresses`,
        _id: id
    });
    const address = addresses?.data;
    useEffect(() => {
        if (!address) return;
        form.setFieldsValue(address);
        setSelected(address.label); 
    }, [address]);
    
    

    const { mutate } = useUpdate({
        resource: `/addresses`,
        _id: id,
    }) 

    const handleFinish = (values: any) => {
        mutate(values);
        nav(`/detailAuth/accountInformation`);
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
                        Cập nhập địa chỉ                     
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
                                
                                prefix={<PhoneOutlined />}
                                placeholder="Nhập số điện thoại"
                                className="rounded-lg h-[40px]"
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
                                prefix={<EnvironmentOutlined />}
                                placeholder="Nhập tỉnh hoặc thành phố"
                                className="rounded-lg h-[40px]"
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
                                    placeholder="Nhập quận hoặc huyện"
                                    className="rounded-lg h-[40px]"
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
                                    placeholder="Nhập phường hoặc xã"
                                    className="rounded-lg h-[40px]"
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
                            placeholder="VD: 123 Lê Văn Sỹ, hẻm 20, gần chợ XYZ"
                            className="rounded-lg h-[40px]"
                        />
                    </Form.Item>
                    <Form.Item label="Laber" 
                        name="label" 
                        rules={[
                            { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                        ]}
                    >
                        <Button type={selected === 'home' ? 'primary' : 'default'} 
                            onClick={() => {
                                setSelected('home')
                                form.setFieldsValue({ label: 'home' })
                            }}
                        >
                            Nhà Riêng
                        </Button>
                        <Button className="ml-4" type={selected === 'office' ? 'primary' : 'default'} 
                            onClick={() => {
                                setSelected('office')
                                form.setFieldsValue({label: 'office'})
                            }}
                        >
                            Văn Phòng
                        </Button>
                    </Form.Item>
                    <div className="flex justify-end gap-4 mt-6">
                        <Button htmlType="reset" style={{height: 40}}>
                            Đặt lại
                        </Button>
                        <Button icon={<PlusOutlined />} type="primary" htmlType="submit" style={{height: 40}} className="w-40">
                            Cập nhập địa chỉ
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default UpdateAddresses;
