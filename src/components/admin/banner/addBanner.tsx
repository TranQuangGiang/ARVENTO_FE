import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Switch,
  InputNumber,
  Card,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { useAddBanner } from "../../../hooks/banner";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate } = useAddBanner({ resource: "/banners/admin" });

  const onFinish = (values: any) => {
    const fileList = values.image;
    if (!fileList || fileList.length === 0) {
      message.error("Please upload an image");
      return;
    }
    const imageFile = fileList[0].originFileObj;

    mutate(
      {
        title: values.title,
        link: values.link,
        position: values.position,
        is_active: values.is_active,
        image: imageFile,
      },
      {
        onSuccess: () => {
          message.success("Banner added successfully");
          form.resetFields();
          setLoading(true),
          navigate("/admin/listbanner", { state: { shouldRefetch: true } });
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Failed to add banner");
          setLoading(false)
        },
      }
    );
  };

  return (
    <div className="ml-6 mr-6 min-h-screen mt-10 bg-gray-50">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Banner</h2>
            <p className="text-sm text-gray-500">Fill in the details to add a new banner.</p>
          </div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/listbanner")}
          >
            Back to List
          </Button>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Section */}
          <div className="space-y-6">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter banner title" className="text-[15px] w-[700px] h-[40px]"  />
            </Form.Item>

            <Form.Item label="Link" name="link">
              <Input placeholder="Optional link when clicking banner" className="text-[15px] h-[40px]" />
            </Form.Item>

            <Form.Item label="Position" name="position">
              <InputNumber
                placeholder="Optional position for sort order"
                className="text-[15px]"
                style={{
                  width: "100%",
                  height: "40px",         // Set chiều cao giống các input
                  display: "flex",
                  alignItems: "center"    // Căn giữa chiều dọc
                }}
              />
            </Form.Item>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <Form.Item
              label="Banner Image"
              name="image"
              valuePropName="file"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div className="mt-1">Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Active"
              name="is_active"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </div>

          {/* Submit Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            
            <Button 
              type="primary"
              icon={<SaveOutlined />}
              htmlType="submit"
              loading={loading}
              style={{height: 40}}
              className="h-[40px] w-[180px]"
            >
              Add Banner
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              htmlType="button"
              onClick={() => form.resetFields()}
              disabled={loading}
              style={{height: 40}}
              className="h-[40px]"
              danger
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddBanner;
