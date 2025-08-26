import React, { useState } from "react";
import { Form, Input, Button, Card, Upload, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useCreate } from "../../../hooks/useCreate";
import {
  OrderedListOutlined,
  ReloadOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const AddCategory = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { mutate } = useCreate<FormData>({
    resource: "/categories/admin",
  });

  const onFinish = (values: any) => {
    if (!values.image || values.image.length === 0) {
      message.error("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("description", values.description || "");

    values.image.forEach((file: any) => {
      if (file.originFileObj) {
        formData.append("image", file.originFileObj);
      }
    });

    setLoading(true);
    mutate(formData, {
      onSuccess: () => {
        nav("/admin/listcategory");
      },
      onError: () => {
        message.error("Failed to create category.");
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 pt-10 ml-6 mr-6 ">
      <Card
        className="w-full mt-6 shadow-md rounded-2xl border border-gray-200"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Thêm mới danh mục
          </h2>
          <Link to={`/admin/listcategory`}>
            <Button
              type="primary"
              icon={<OrderedListOutlined />}
              style={{ width: 200, height: 40 }}
            >
              Danh sách danh mục
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Điền thông tin chi tiết để tạo danh mục mới.
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="space-y-5"
          onValuesChange={(changedValues, allValues) => {
            if ("name" in changedValues) {
              const rawName = changedValues.name || "";
              const generatedSlug = rawName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9 ]/g, "")
                .trim()
                .replace(/\s+/g, "-");
              form.setFieldsValue({ slug: generatedSlug });
            }
          }}
        >
          <Form.Item
            label={<span className="text-base font-medium">Tên danh mục</span>}
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" className="h-10" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium">Đường dẫn</span>}
            name="slug"
            rules={[{ required: true, message: "Đường liên kết không bỏ trống" }]}
          >
            <Input placeholder="Đường dẫn" className="h-10" size="large" />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium">Mô tả</span>}
            name="description"
          >
            <Input.TextArea placeholder="Nhập mô tả" rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label={<span className="text-base font-medium">Ảnh danh mục</span>}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Vui lòng upload ảnh sản phẩm" }]}
          >
            <Upload 
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={1} // chỉ 1 ảnh duy nhất
              multiple={false}
              accept="image/*"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

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
              danger
              htmlType="button"
              onClick={() => form.resetFields()}
              className="rounded-xl"
              style={{ height: 40 }}
              icon={<ReloadOutlined />}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategory;
