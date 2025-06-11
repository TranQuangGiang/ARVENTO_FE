import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import { useUpdate } from "../../../hooks/useUpdate";

const EditCategory = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { id } = useParams();

  const { data: category} = useOneData({resource: `/categories/admin`, _id:id});
      useEffect(() => {
          if (!category || !category.data) return;
          // Gán dữ liệu form
          form.setFieldsValue({
              ...category.data,
              category: category.data.category?._id || "",
          });
         
      }, [category, form]);
    const {mutate} = useUpdate<FormData>({
      resource: "/categories/admin",
      _id:id
    })
    function onFinish (values: any) {
      mutate(values);
      nav('/admin/listcategory');
   };
   


  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">EDIT CATEGORY</h3>
      <p className="text-sm text-gray-500 mb-6">Edit a category to the website</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
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
              Edit Category
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

export default EditCategory;
function setContent(content: any) {
  throw new Error("Function not implemented.");
}

function setThumbnail(thumbnail: any) {
  throw new Error("Function not implemented.");
}

