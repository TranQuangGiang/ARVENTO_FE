import React, { useState } from "react";
import { Form, Button, Card, Select, Input, Space, message } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCreate } from "../../../hooks/useCreate";

const { Option } = Select;

const AddColorAvarin = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  const { mutate } = useCreate<any>({
    resource: "/options/batch",
  });

  const onFinish = (values: any) => {
    let formattedValues = [];

    if (values.key === "color") {
      formattedValues =
        values.values?.map((v: any) => ({
          name: v.name,
          hex: v.hex,
        })) || [];
    } else {
      formattedValues = values.values || [];
    }

    mutate(
      [
        {
          key: values.key,
          values: formattedValues,
        },
      ],
      {
        onSuccess: () => {
          setLoading(false);
          nav("/admin/listcolor");
        },
        onError: () => {
          setLoading(false);
          message.error("Failed to add option");
        },
      }
    );
    setLoading(true);
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 pt-10 ml-6 mr-6">
      <Card
        className="w-full mt-6 shadow-md rounded-2xl border border-gray-200"
        bodyStyle={{ padding: "2rem" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Option</h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details to add a new option.
        </p>

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
            <Select
              placeholder="Select option key"
              size="large"
              onChange={(value) => {
                setSelectedKey(value);
                // Reset values khi đổi key
                form.setFieldsValue({ values: value === "color" ? [{}] : [] });
              }}
            >
              <Option value="color">Color</Option>
              <Option value="size">Size</Option>
            </Select>
          </Form.Item>

          {selectedKey === "color" && (
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
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[{ required: true, message: "Name required" }]}
                      >
                        <Input placeholder="Name (e.g., Red)" />
                      </Form.Item>
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
          )}

          {selectedKey === "size" && (
            <Form.Item
              label="Values"
              name="values"
              rules={[{ required: true, message: "Please enter at least one value" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Press Enter to add each size (e.g., S, M, L)"
                size="large"
                tokenSeparators={[","]}
              />
            </Form.Item>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              htmlType="submit"
              className="rounded-xl"
              icon={<SaveOutlined />}
              loading={loading}
              style={{ height: 40 }}
              type="primary"
            >
              Save Option
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
      </Card>
    </div>
  );
};

export default AddColorAvarin;
