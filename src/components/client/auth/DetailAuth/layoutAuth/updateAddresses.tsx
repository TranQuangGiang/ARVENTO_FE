import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  message,
  Select,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import { useUpdate } from "../../../../../hooks/useUpdate";
import { useOneData } from "../../../../../hooks/useOne";
import { useList } from "../../../../../hooks/useList";
import { X } from "lucide-react";

const { Title } = Typography;
const { Option } = Select;

const UpdateAddresses = ({ isOpen, onClose, addressId, onRefetch }: any) => {
    const [showModal, setShowModal] = useState<"addAddress" | null>("addAddress");
    const [form] = Form.useForm();
    const [ selected,setSelected ] = useState('');
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

    const { data, refetch } = useOneData({
        resource: '/addresses',
        _id: addressId
    });
    const { data: provinces, refetch: refetchProvinces } = useList({ resource: '/ghn/provinces' });
    const { data: districtsData } = useList({ resource: `/ghn/districts?province_id=${selectedProvince}` });
    const { data: wardsData } = useList({ resource: `/ghn/wards?district_id=${selectedDistrict}` });
    const { mutate } = useUpdate({ resource: `/addresses`, _id: addressId });

    useEffect(() => {
        if (isOpen) refetchProvinces();
    }, [isOpen]);

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data.data);
            setSelected(data.data.label);
            setSelectedProvince(data.data.province_id);
            setSelectedDistrict(data.data.district_id);
        }
    }, [data]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
            setShowModal("addAddress");
        };
    };

    const handleFinish = (values: any) => {
        mutate(values, {
            onSuccess: () => {
                onRefetch();
                form.resetFields();
                setSelected('');
                setSelectedProvince(null);
                setSelectedDistrict(null);
                onClose();
            },
            onError: () => {
                message.error("Cập nhật địa chỉ thất bại");
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={handleOverlayClick}
                >   
                    <motion.div
                        key="content"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] h-[470px] p-6 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute px-1.5 py-1.5 z-20 top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 hover:rounded-[50%] flex items-center justify-center transition-all duration-300"
                        >
                            <X />
                        </button>
                        { showModal === "addAddress" && (
                            <div className="flex w-[95%] justify-center ">
                                <Card
                                    className="w-full max-w-[1217px] shadow-md border border-gray-200 rounded-xl bg-white"
                                    bodyStyle={{ padding: "32px 40px", maxHeight: "400px", overflowY: "auto" }}
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
                                                <Form.Item name="province_id" hidden><Input /></Form.Item>
                                                <Form.Item
                                                    label="Tỉnh / Thành phố"
                                                    name="province"
                                                    rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Chọn tỉnh hoặc thành phố"
                                                        className="rounded-lg"
                                                        style={{ height: 40 }}
                                                        onChange={(provinceId) => {
                                                            const selected = provinces.find((p: any) => p.ProvinceID === provinceId);
                                                            setSelectedProvince(provinceId);
                                                            form.setFieldsValue({
                                                                province_id: provinceId,
                                                                province: selected?.ProvinceName,
                                                                district: null,
                                                                district_id: null,
                                                                ward: null,
                                                                ward_code: null
                                                            });
                                                        }}
                                                        filterOption={(input, option: any) =>
                                                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                                        }
                                                    >
                                                        {provinces?.map((province: any) => (
                                                        <Option key={province.ProvinceID} value={province.ProvinceID}>
                                                            {province.ProvinceName}
                                                        </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item name="district_id" hidden><Input /></Form.Item>
                                                <Form.Item
                                                    label="Quận / Huyện"
                                                    name="district"
                                                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Chọn quận hoặc huyện"
                                                        className="rounded-lg"
                                                        style={{ height: 40 }}
                                                        disabled={!selectedProvince}
                                                        onChange={(districtId) => {
                                                            const selected = districtsData?.find((d: any) => d.DistrictID === districtId);
                                                            setSelectedDistrict(districtId);
                                                            form.setFieldsValue({
                                                                district_id: districtId,
                                                                district: selected?.DistrictName,
                                                                ward: null,
                                                                ward_code: null
                                                            });
                                                        }}
                                                        filterOption={(input, option: any) =>
                                                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                                        }
                                                    >
                                                        {districtsData?.map((district: any) => (
                                                            <Option key={district.DistrictID} value={district.DistrictID}>
                                                                {district.DistrictName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={12}>
                                                <Form.Item name="ward_code" hidden><Input /></Form.Item>
                                                <Form.Item
                                                    label="Phường / Xã"
                                                    name="ward"
                                                    rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
                                                >
                                                    <Select
                                                        showSearch
                                                        placeholder="Chọn phường hoặc xã"
                                                        className="rounded-lg"
                                                        style={{ height: 40 }}
                                                        disabled={!selectedDistrict}
                                                        onChange={(wardCode, option: any) => {
                                                            form.setFieldsValue({
                                                                ward_code: wardCode,
                                                                ward: option?.children
                                                            });
                                                        }}
                                                        filterOption={(input, option: any) =>
                                                            (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                                        }
                                                    >
                                                        {Array.isArray(wardsData) && wardsData.map((ward: any) => (
                                                            <Option key={ward.WardCode} value={ward.WardCode}>
                                                                {ward.WardName}
                                                            </Option>
                                                        ))}
                                                    </Select>
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
                                            name="Loại địa chỉ" 
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
                                                Cập nhập
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

export default UpdateAddresses;
