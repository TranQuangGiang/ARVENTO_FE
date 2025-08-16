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
import { useList } from "../../../hooks/useList"; // Thêm hook để lấy danh sách thuộc tính hiện có

const { Option } = Select;

const AddColorAvarin = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  // Lấy danh sách các thuộc tính hiện có từ API
  const { data: existingOptions } = useList({
    resource: "/options",
  });

  const { mutate } = useCreate<any>({
    resource: "/options/batch",
  });

  const onFinish = (values: any) => {
    // Kiểm tra xem thuộc tính đã tồn tại chưa
    const isKeyExists = existingOptions?.data?.some((option: any) => option.key === values.key);

    if (isKeyExists) {
      // Nếu đã tồn tại, hiển thị lỗi và không gọi API
      message.error(`Thuộc tính "${values.key}" đã tồn tại. Vui lòng chọn thuộc tính khác.`);
      return;
    }

    setLoading(true);

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
          message.success("Thêm tùy chọn thành công");
          nav("/admin/listcolor");
        },
        onError: () => {
          setLoading(false);
          message.error("Không thêm được tùy chọn");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 pt-10 ml-6 mr-6">
      <Card
        className="w-full mt-6 shadow-md rounded-2xl border border-gray-200"
        bodyStyle={{ padding: "2rem" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thêm mới thuộc tính</h2>
        <p className="text-sm text-gray-500 mb-6">
          Điền thông tin chi tiết để thêm tùy chọn mới.
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ values: [{}] }}
        >
          <Form.Item
            label="Thuộc tính"
            name="key"
            rules={[{ required: true, message: "Vui lòng chọn thuộc tính" }]}
          >
            <Select
              placeholder="Chọn thuộc tính"
              size="large"
              onChange={(value) => {
                setSelectedKey(value);
                form.setFieldsValue({ values: value === "color" ? [{}] : [] });
              }}
            >
              <Option value="color">Màu sắc</Option>
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
                      return Promise.reject(new Error("Nhập ít nhất 1 giá trị"));
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
                        rules={[{ required: true, message: "Vui lòng nhâp tên" }]}
                      >
                        <Input placeholder="Name (e.g., Red)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "hex"]}
                        rules={[
                          { required: true, message: "Mã không để trống" },
                          {
                            pattern: /^#[0-9A-Fa-f]{6}$/,
                            message: "Mã phải hợp lệ (e.g., #ffffff)",
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
                      Thêm mới
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}

          {selectedKey === "size" && (
            <Form.Item
              label="Giá trị"
              name="values"
              rules={[{ required: true, message: "Please enter at least one value" }]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Nhấn Enter để thêm từng kích thước (e.g., S, M, L)"
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
              Thêm mới
            </Button>
            <Button
              htmlType="button"
              className="rounded-xl"
              onClick={() => nav("/admin/listcolor")}
              style={{ height: 40 }}
              icon={<ArrowLeftOutlined />}
            >
              Quay lại
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddColorAvarin;