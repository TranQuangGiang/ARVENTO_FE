import React, { useEffect, useState } from "react";
import {
  Card, Form, Input, Button, Typography, Row, Col, Select,
  message
} from "antd";
import {
  PhoneOutlined, HomeOutlined, PlusOutlined
} from "@ant-design/icons";
import { AnimatePresence, motion } from 'framer-motion';
import { useCreate } from "../../../../../hooks/useCreate";
import { useList } from "../../../../../hooks/useList";
import { X } from "lucide-react";
const { Option } = Select;
const { Title } = Typography;

const AddAddresses = ({ isOpen, onClose }: any) => {
  const [showModal, setShowModal] = useState<"addAddress" | null>("addAddress");
  const [isLoading, setIdLoading] = useState(false);
  const [form] = Form.useForm();
  const [selected, setSelected] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setShowModal("addAddress");
    }
  };

  const token = localStorage.getItem("token")
  const { data:addresses, refetch } = useList({ 
    resource: `/addresses/me`,
    token: token
  });

  const { mutate } = useCreate({ resource: `/addresses/me` });

  const handleFinish = (values: any) => {
    setIdLoading(true)
    mutate(values, {
      onSuccess: () => {
        refetch();
        form.resetFields(); // reset form fields
        setSelectedProvince(null); // reset tỉnh
        setSelectedDistrict(null); // reset huyện
        setSelected(""); // reset label 'home' hoặc 'office'
        onClose();
      },
      onError: (error) => {
        console.log("Tạo địa chỉ lỗi: ", error); 
      },
      onSettled: () => {
        setIdLoading(false);
      }
    });
  };

  const { data: provinces, refetch: refetchProvinces } = useList({
    resource: '/ghn/provinces'
  });

  const { data: districtsData } = useList({
    resource: `/ghn/districts?province_id=${selectedProvince}`,
  });

  const { data: wardsData } = useList({
    resource: `/ghn/wards?district_id=${selectedDistrict}`,
  });

  useEffect(() => {
    if (isOpen) {
      refetchProvinces();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <motion.div
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
            {showModal === "addAddress" && (
              <div className="flex w-[95%] justify-center">
                <Card
                  className="w-full max-w-[1217px] shadow-md border rounded-xl"
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
                            {
                              pattern: /^0\d{9}$/,
                              message: "Số điện thoại không hợp lệ."
                            }
                          ]}
                        >
                          <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" className="rounded-lg h-[40px]" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        {/* Hidden field province_id */}
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
                            style={{height: 40}}
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
                              (option?.children as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase())
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
                            {/* Hidden field district_id */}
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
                                    style={{height: 40}}
                                    disabled={!selectedProvince}
                                    onChange={(districtId) => {
                                        const selected = districtsData?.find((d: any) => d.DistrictID === districtId);
                                        setSelectedDistrict(districtId);
                                        form.setFieldsValue({
                                            district_id: districtId, // ID để gửi lên API
                                            district: selected?.DistrictName, // tên hiển thị
                                            ward: null,
                                            ward_code: null,
                                        });
                                    }}
                                    filterOption={(input, option: any) =>
                                    (option?.children as string)
                                        ?.toLowerCase()
                                        .includes(input.toLowerCase())
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
                        {/* Hidden field ward_code */}
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
                            style={{height: 40}}
                            disabled={!selectedDistrict}
                            onChange={(wardCode, option:any) => {
                              form.setFieldsValue({
                                ward_code: wardCode,
                                ward: option?.children
                              });
                            }}
                            filterOption={(input, option: any) =>
                              (option?.children as string)
                                ?.toLowerCase()
                                .includes(input.toLowerCase())
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
                      rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết" }]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="VD: 123 Lê Văn Sỹ, hẻm 20, gần chợ XYZ"
                        className="rounded-lg h-[40px]"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Loại địa chỉ"
                      name="label"
                      rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ" }]}
                    >
                      <div className="flex gap-4">
                        <Button
                          type={selected === 'home' ? 'primary' : 'default'}
                          onClick={() => {
                            setSelected('home');
                            form.setFieldsValue({ label: 'home' });
                          }}
                        >
                          Nhà Riêng
                        </Button>
                        <Button
                          type={selected === 'office' ? 'primary' : 'default'}
                          onClick={() => {
                            setSelected('office');
                            form.setFieldsValue({ label: 'office' });
                          }}
                        >
                          Văn Phòng
                        </Button>
                      </div>
                    </Form.Item>

                    <div className="flex justify-end gap-4 mt-6">
                      <Button onClick={onClose} htmlType="reset" style={{ height: 40 }}>
                        Hủy
                      </Button>
                      <Button loading={isLoading} icon={<PlusOutlined />} type="primary" htmlType="submit" style={{ height: 40 }} className="w-40">
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

export default AddAddresses;
