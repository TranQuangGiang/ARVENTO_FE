import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";

const AddCategory = () => {
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
  };

  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW CATEGORY</h3>
      <p className="text-sm text-gray-500 mb-6">Add a new category to the website</p>
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
              Slug
            </span>
          }
          name="slug"
          rules={[{ required: true, message: "Please enter the slug" }]}
        >
          <Input placeholder="Enter slug" />
        </Form.Item>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 mb-4"
          />
        )}

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Add Category
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setPreviewUrl(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </Form.Item>

      </Form>
    </div>
  );
};

export default AddCategory;
