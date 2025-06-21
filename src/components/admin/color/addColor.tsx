import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const AddColor = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Color Data:', values);

    const fileList = values.image;
    if (!fileList || fileList.length === 0) {
      message.error("Please upload an image");
      return;
    }

    const imageFile = fileList[0].originFileObj;

    // In ra dữ liệu khi submit (bạn có thể xử lý API tại đây nếu muốn)
    console.log("Submitted Color:", {
      name: values.name,
      image: imageFile,
    });

    message.success("Color added (check console log)");
    form.resetFields();
  };

  return (
    <div className="p-6 bg-white min-h-screen mt-20 w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-1">ADD NEW COLOR</h3>
      <p className="text-sm text-gray-500 mb-6">Add a new color to the website</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the color name" }]}
        >
          <Input placeholder="Enter color name" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">
              Add Color
            </Button>
            <Button
              onClick={() => {
                navigate("/admin/listcolor");
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

export default AddColor;
