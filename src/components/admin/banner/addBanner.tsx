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
          message.success("Thêm mới banner thành công");
          form.resetFields();
          setLoading(true),
          navigate("/admin/listbanner", { state: { shouldRefetch: true } });
        },
        onError: (err: any) => {
          message.error(err.response?.data?.message || "Thêm banner thất bại");
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
            <h2 className="text-2xl font-bold text-gray-800">Thêm Banner mới</h2>
            <p className="text-sm text-gray-500">Điền thông tin để thêm banner mới.</p>
          </div>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/listbanner")}
          >
            Quay lại danh sách
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
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Vui lòng nhập tiêu đề" className="text-[15px] w-[700px] h-[40px]"  />
            </Form.Item>

            <Form.Item label="Liên kết" name="link">
              <Input placeholder="Liên kết tùy chọn khi nhấp vào banner" className="text-[15px] h-[40px]" />
            </Form.Item>

            <Form.Item label="Vị trí" name="position">
              <InputNumber
                placeholder="Nhập vị trí cho banner"
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
              label="Ảnh"
              name="image"
              valuePropName="file"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              rules={[{ required: true, message: "Vui lòng tải lên hình ảnh" }]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
                listType="picture-card"
              >
                <div>
                  <UploadOutlined />
                  <div className="mt-1">Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Trang thái"
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
              Thêm mới
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
              Hủy 
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddBanner;
