import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useCreate } from "../../hooks/useCreate";
import { useList } from "../../hooks/useList";

const { Title } = Typography;

const AddAddressesClient = ({ isOpen, onClose }: any) => {
    const [showModal, setShowModal] = useState<"addAddress" | null>("addAddress");
    const [form] = Form.useForm();
    const [ selected,setSelected ] = useState('');

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
            setShowModal("addAddress");
        }
    };

     const { data, refetch } = useList({
        resource: `/addresses/me`
    }); 

    const { mutate } = useCreate({
        resource: `/addresses/me`
    }) 

    const handleFinish = (values: any) => {
        mutate(values ,{
            onSuccess: () => {
                refetch();
                form.resetFields();
                setSelected("");
                onClose();
            }
        });
        
    };

    return (
        <AnimatePresence>
            { isOpen && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={handleOverlayClick}
                key="overlay"
            >   
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-3xl h-[470px] p-6"
                    key="modal"
                >
                    { showModal === "addAddress" && (
                        <div className="flex w-full justify-center ">
                            <Card
                                className="w-full max-w-[1217px] shadow-md border border-gray-200 rounded-xl bg-white"
                                bodyStyle={{ padding: "32px 40px", maxHeight: "400px", overflowY: "auto" }}
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
                                        <Button onClick={onClose} htmlType="reset" style={{height: 40}}>
                                            Hủy
                                        </Button>
                                        <Button icon={<PlusOutlined />} type="primary" htmlType="submit" style={{height: 40}} className="w-40">
                                            Thêm địa chỉ
                                        </Button>
                                    </div>
                                </Form>
                            </Card>
                        </div>
                    )}
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddAddressesClient;
