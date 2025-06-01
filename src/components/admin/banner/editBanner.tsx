import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Switch,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

const fetchBanner = async (id: string) => {
  const res = await axios.get(`/banners/${id}`);
  return res.data?.data;
};

const EditBanner = () => {
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
    <div className="p-6 bg-white min-h-screen mt-20 w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-1">EDIT BANNER</h3>
      <p className="text-sm text-gray-500 mb-6">Update banner details</p>
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
          <InputNumber style={{ width: "100%" }} placeholder="Position (optional)" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList || []}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            listType="picture"
            defaultFileList={
              previewUrl
                ? [
                    {
                      uid: "-1",
                      name: "current-image.png",
                      status: "done",
                      url: previewUrl,
                    },
                  ]
                : []
            }
          >
            <Button icon={<UploadOutlined />}>Upload New Image</Button>
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
              Update Banner
            </Button>
            <Button onClick={() => navigate("/admin/listbanner")}>Cancel</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBanner;
