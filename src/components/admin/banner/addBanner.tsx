import React from "react";
import { Form, Input, Button, Upload, message, Switch, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAddBanner } from "../../../hooks/banner";
import { useNavigate } from "react-router-dom";

const AddBanner = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate } = useAddBanner({ resource: "/banners/admin" });

  const onFinish = (values: any) => {
    console.log('dl',values);
    
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
          navigate("/admin/listbanner", { state: { shouldRefetch: true } });
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Failed to add banner");
        },
      }
    );
  };

  return (
    <div className="p-6 bg-white min-h-screen mt-20 w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW BANNER</h3>
      <p className="text-sm text-gray-500 mb-6">Add a new banner to the website</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the title" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item label="Link" name="link">
          <Input placeholder="Enter link (optional)" />
        </Form.Item>

        <Form.Item label="Position" name="position">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Position (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="file"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList;
          }}
          rules={[{ required: true, message: "Please upload an image" }]}
        >
          <Upload
            beforeUpload={() => false} 
            maxCount={1}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
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

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Add Banner
            </Button>
            <Button
              onClick={() => {
                navigate("/admin/listbanner")
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

export default AddBanner;
