import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AddBanner = () => {
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    return false; // Ngăn antd tự upload
  };

  const onFinish = (values: any) => {
    if (!values.image || values.image.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const imageFile = values.image[0].originFileObj;

    console.log("Submitted values:", {
      ...values,
      image: imageFile,
    });

    // Gửi form đi (API call...)
  };

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW BANNER</h3>
      <p className="text-sm text-gray-500 mb-6">Add a new banner to the website</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="space-y-4"
      >
        <Form.Item
          label={
            <span className="text-[15px]">
              Title
            </span>
          }
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-[15px]" >
              Link
            </span>
          }
          name="link"
          rules={[{ required: true, message: "Please enter the link" }]}
        >
          <Input placeholder="Enter link" />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-[15px]">
              Image
            </span>
          }
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={handleImageChange}
            accept="image/*"
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Click or Drag to Upload</Button>
          </Upload>
        </Form.Item>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 mb-4"
          />
        )}

        <Form.Item className="flex justify-end gap-2">
          <Button type="primary" htmlType="submit">
            Add Banner
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              setPreviewUrl(null);
            }}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBanner;
