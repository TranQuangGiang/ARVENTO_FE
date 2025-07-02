import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import { useUpdate } from "../../../hooks/useUpdate";
import { OrderedListOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";

const EditCategory = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      nav('/admin/listcategory');
   };
   


  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 pt-10 ml-6 mr-6 ">
      <Card
        className="w-full mt-6 shadow-md rounded-2xl border border-gray-200"
        bodyStyle={{ padding: "2rem" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Category
          </h2>
          <Link to={`/admin/listcategory`}>
            <Button type="primary" icon={<OrderedListOutlined />} style={{width: 200, height: 40}}>List Category</Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details to add a new category.
        </p>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="space-y-5"
        >
          <Form.Item
            label={<span className="text-base font-medium">Title</span>}
            name="name"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input
              placeholder="Enter title"
              className="h-10"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium">Slug</span>}
            name="slug"
            rules={[{ required: true, message: "Please enter the slug" }]}
          >
            <Input
              placeholder="Enter slug"
              className="h-10"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-base font-medium">Description</span>}
            name="description"
          >
            <Input.TextArea
              placeholder="Enter description"
              rows={4}
            />
          </Form.Item>

          <div className="flex justify-end space-x-3">
            <Button
              htmlType="button"
              onClick={() => nav("/admin/listcategory")}
              className="rounded-xl"
              icon={<SaveOutlined />}
              loading={loading}
              style={{height: 40}}
              type="primary"
            >
              Update Category
            </Button>
            <Button
              danger
              htmlType="submit"
              className="rounded-xl"
              size="middle"
              onClick={() => form.resetFields()}
              style={{height: 40}}
              icon={<ReloadOutlined />}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
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