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

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        link: banner.link,
        position: banner.position,
        is_active: banner.is_active,
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
      message.success("Banner update successfully");
      setLoading(true);
      queryClient.invalidateQueries({ queryKey: ["bannersAdmin"] });
      navigate("/admin/listbanner");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Update failed");
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
            <h2 className="text-2xl font-bold text-gray-800">Edit Banner</h2>
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
              Update Banner
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

export default EditBanner;
