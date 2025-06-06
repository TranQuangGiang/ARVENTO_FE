import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreate } from "../../../hooks/useCreate";

const AddCategory = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {mutate} = useCreate<FormData>({
    resource: "/categories/admin"
  })
   const onFinish = (values: any) => {
  console.log("dl", values);

  mutate({
    name: values.name,
    slug: values.slug,
    description: values.description
  });
  nav('/admin/listcategory');
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
          name="name"
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
        <Form.Item
          label={
            <span className="text-[15px]" >
              Description
            </span>
          }
          name="description"
          rules={[{ required: false, message: "Please enter the description" }]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>
        

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Add Category
            </Button>
            <Button
              onClick={() => nav("/admin/listcategory")}
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
