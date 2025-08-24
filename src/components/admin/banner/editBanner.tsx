import React, { useEffect, useState } from "react";
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
import { ArrowLeftOutlined, ReloadOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const fetchBanner = async (id: string) => {
  const res = await axios.get(`/banners/${id}`);
  return res.data?.data;
};

const EditBanner = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: banner } = useQuery({
    queryKey: ["banner", id],
    queryFn: () => fetchBanner(id!),
    enabled: !!id,
  });
  console.log(banner);
  
  useEffect(() => {
    if (banner) {
      const fileList = banner.image_url ? [
        {
          uid: '-1',
          name: 'banner.jpg',
          status: 'done',
          url: banner.image_url,
        },
      ] : [];

      form.setFieldsValue({
        title: banner.title,
        link: banner.link,
        position: banner.position,
        is_active: banner.is_active,
        image: fileList
      });
      setPreviewUrl(banner.image);
    }
  }, [banner, form]);

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const token = localStorage.getItem("token") || "";
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("link", values.link || "");
      formData.append("position", String(values.position ?? 0));
      formData.append("is_active", String(values.is_active ?? true));

      const fileList = values.image;
      if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      return axios.put(`/banners/admin/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      message.success("Cập nhâp banner thành công");
      setLoading(true);
      queryClient.invalidateQueries({ queryKey: ["bannersAdmin"] });
      navigate("/admin/listbanner");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Cập nhập thất bại");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };


  return (
    <div className="ml-6 mr-6 min-h-screen mt-10 bg-gray-50">
      <Card className="shadow-lg rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cập nhập banner</h2>
            <p className="text-sm text-gray-500">Điền thông tin chi tiết để cập nhập banner.</p>
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
              valuePropName="fileList"
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
              label="Trạng thái"
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
              Cập nhập
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
              Đặt lại
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditBanner;
