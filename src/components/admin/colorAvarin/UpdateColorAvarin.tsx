import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Select,
  Input,
  Space,
  message,
  Spin,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const UpdateColorAvarin = () => {
  const nav = useNavigate();
  const { key } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOption = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:3000/api/options/${key}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const option = data.data;
        if (option.key === "color") {
          form.setFieldsValue({
            key: option.key,
            values: option.values.map((v: any) => ({
              name: v.name,
              hex: v.hex,
            })),
          });
        } else {
          form.setFieldsValue({
            key: option.key,
            values: option.values.map((v: string) => ({ name: v })),
          });
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch option");
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchOption();
    }
  }, [key, form]);

  const onFinish = async (values: any) => {
    try {
      setSubmitLoading(true);

      let formattedValues;
      if (values.key === "color") {
        formattedValues = values.values?.map((v: any) => ({
          name: v.name,
          hex: v.hex,
        })) || [];
      } else {
        formattedValues = values.values?.map((v: any) => v.name) || [];
      }

      // 👉 Log dữ liệu gửi đi
      console.log("Dữ liệu gửi lên BE:", {
        values: formattedValues,
      });

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/options/${key}`,
        {
          values: formattedValues,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Option updated successfully");
      nav("/admin/listcolor");
    } catch (error) {
      console.error(error);
      message.error("Failed to update option");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 pt-10 ml-6 mr-6">
      <Card
        className="w-full mt-6 shadow-md rounded-2xl border border-gray-200"
        bodyStyle={{ padding: "2rem" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Update Option</h2>
        <p className="text-sm text-gray-500 mb-6">Update the details of this option.</p>

        <Spin spinning={loading}>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            initialValues={{ values: [{}] }}
          >
            <Form.Item
              label="Key"
              name="key"
              rules={[{ required: true, message: "Please select the key" }]}
            >
              <Select placeholder="Select option key" disabled>
                <Option value="color">Color</Option>
                <Option value="size">Size</Option>
              </Select>
            </Form.Item>

            <Form.List
              name="values"
              rules={[
                {
                  validator: async (_, names) => {
                    if (!names || names.length < 1) {
                      return Promise.reject(new Error("At least 1 value"));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key: fieldKey, name, ...restField }) => (
                    <Space
                      key={fieldKey}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[{ required: true, message: "Name required" }]}
                      >
                        <Input placeholder="Name (e.g., Red or 42)" />
                      </Form.Item>
                      {form.getFieldValue("key") === "color" && (
                        <Form.Item
                          {...restField}
                          name={[name, "hex"]}
                          rules={[
                            { required: true, message: "Hex required" },
                            {
                              pattern: /^#[0-9A-Fa-f]{6}$/,
                              message: "Hex must be valid (e.g., #ffffff)",
                            },
                          ]}
                        >
                          <Input placeholder="#ffffff" />
                        </Form.Item>
                      )}
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Value
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <div className="flex justify-end space-x-3">
              <Button
                htmlType="submit"
                className="rounded-xl"
                icon={<SaveOutlined />}
                style={{ height: 40 }}
                type="primary"
                loading={submitLoading}
              >
                Update Option
              </Button>
              <Button
                htmlType="button"
                className="rounded-xl"
                onClick={() => nav("/admin/listcolor")}
                style={{ height: 40 }}
                icon={<ArrowLeftOutlined />}
              >
                Back
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default UpdateColorAvarin;
