import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Select,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AnimatePresence, motion } from 'framer-motion';
import { useCreate } from "../../hooks/useCreate";
import { useList } from "../../hooks/useList";

const { Option } = Select;
const { Title } = Typography;

const AddAddressesClient = ({ isOpen, onClose }: any) => {
  const [showModal, setShowModal] = useState<"addAddress" | null>("addAddress");
  const [form] = Form.useForm();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

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
  });

  const handleFinish = (values: any) => {
    setLoading(true); // Start loading

    mutate(values, {
      onSuccess: () => {
        refetch();
        form.resetFields();
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelected("");
        onClose();
        setLoading(false); // End loading
      },
      onError: () => {
        setLoading(false); // End loading even if there's an error
      }
    });
  };

  {/* Province */}
  const { data: provinces, refetch: refetchProvinces } = useList({
    resource: '/ghn/provinces'
  });

  {/** District */}
  const { data: districtsData } = useList({
    resource: `/ghn/districts?province_id=${selectedProvince}`,
  });

  {/** Ward */}
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
            {showModal === "addAddress" && (
              <div className="flex w-full justify-center ">
                <Card
                  className="w-full max-w-[1217px] shadow-md border border-gray-200 rounded-xl bg-white"
                  bodyStyle={{ padding: "32px 40px", maxHeight: "400px", overflowY: "auto" }}
                >
                  <div className="text-center mb-6">
                    <Title level={3}>
                      <HomeOutlined className="mr-2 text-blue-500" />
                      Add New Address
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
                          label="Phone Number"
                          name="phone"
                          rules={[
                            { required: true, message: "Please enter phone number" },
                          ]}
                        >
                          <Input
                            prefix={<PhoneOutlined />}
                            placeholder="Enter phone number"
                            className="rounded-lg h-[40px]"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        {/* Hidden field province_id */}
                        <Form.Item name="province_id" hidden><Input /></Form.Item>

                        <Form.Item
                          label="Province / City"
                          name="province"
                          rules={[{ required: true, message: "Please select province/city" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select province or city"
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
                          label="District / County"
                          name="district"
                          rules={[{ required: true, message: "Please select district/county" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select district or county"
                            className="rounded-lg"
                            style={{ height: 40 }}
                            disabled={!selectedProvince}
                            onChange={(districtId) => {
                              const selected = districtsData?.find((d: any) => d.DistrictID === districtId);
                              setSelectedDistrict(districtId);
                              form.setFieldsValue({
                                district_id: districtId, // ID to send to API
                                district: selected?.DistrictName, // display name
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
                          label="Ward / Commune"
                          name="ward"
                          rules={[{ required: true, message: "Please select ward/commune" }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select ward or commune"
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
                      label="Detailed Address"
                      name="detail"
                      rules={[
                        { required: true, message: "Please enter detailed address" },
                      ]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="E.g., 123 Le Van Sy, alley 20, near XYZ market"
                        className="rounded-lg h-[40px]"
                      />
                    </Form.Item>
                    <Form.Item label="Label"
                      name="label"
                      rules={[
                        { required: true, message: "Please select an address label" },
                      ]}
                    >
                      <Button type={selected === 'home' ? 'primary' : 'default'}
                        onClick={() => {
                          setSelected('home')
                          form.setFieldsValue({ label: 'home' })
                        }}
                      >
                        Home
                      </Button>
                      <Button className="ml-4" type={selected === 'office' ? 'primary' : 'default'}
                        onClick={() => {
                          setSelected('office')
                          form.setFieldsValue({ label: 'office' })
                        }}
                      >
                        Office
                      </Button>
                    </Form.Item>
                    <div className="flex justify-end gap-4 mt-6">
                      <Button onClick={onClose} htmlType="reset" style={{ height: 40 }}>
                        Cancel
                      </Button>
                      <Button icon={<PlusOutlined />} loading={loading} type="primary" htmlType="submit" style={{ height: 40 }} className="w-40">
                        Add Address
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