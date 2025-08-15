import React, { useEffect } from "react";
import { Form, Input, Button, Upload, Switch, Rate, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import { useUpdate } from "../../../hooks/useUpdate";

const UpdateReview = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: review } = useOneData({ resource: `/reviews`, _id: id });
  const { mutate } = useUpdate({ resource: "/reviews", _id: id });

  useEffect(() => {
    if (review?.data) {
      const files = (review.data.images || []).map((url: string, index: number) => ({
        uid: `-${index}`,
        name: `review-image-${index}.jpg`,
        status: "done",
        url,
      }));

      form.setFieldsValue({
      hidden: !review.data.hidden, 
      comment: review.data.comment,
      reply: review.data.reply,
      rating: review.data.rating,
      status: review.data.status || "pending",
      images: files,
    });

    }
  }, [review, form]);

 const onFinish = (values: any) => {
  const payload = {
    ...review.data,          // giữ nguyên dữ liệu cũ
    reply: values.reply,     // cập nhật reply mới
  };
  mutate(payload, {
    onSuccess: (res) => {
      navigate("/admin/listreview", {
        state: { updatedReview: res.data },
      });
    },
  });
};


  return (
    <div className="w-full mx-auto p-6 bg-white min-h-screen mt-20">
      <h3 className="text-2xl font-semibold mb-1">UPDATE REVIEW</h3>
      <p className="text-sm text-gray-500 mb-6">Edit reply to review</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form layout="vertical" onFinish={onFinish} form={form} className="space-y-4">
        <Form.Item label="User">
          <Input value={review?.data?.user_id?.name} disabled />
        </Form.Item>

        <Form.Item label="Product ID">
          <Input value={review?.data?.product_id?._id} disabled />
        </Form.Item>

        <Form.Item label="Product Name">
          <Input value={review?.data?.product_id?.name} disabled />
        </Form.Item>

        <Form.Item name="hidden" label="Ẩn / Hiện" valuePropName="checked">
          <Switch disabled />
        </Form.Item>

        <Form.Item name="status" label="Phê duyệt">
          <Select disabled>
            <Select.Option value="pending">Chờ duyệt</Select.Option>
            <Select.Option value="approved">Đã duyệt</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="rating" label="Rating">
          <Rate disabled />
        </Form.Item>

        <Form.Item name="comment" label="Comment">
          <Input.TextArea rows={3} disabled />
        </Form.Item>

        <Form.Item
          name="images"
          label="Images"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            name="file"
            listType="picture"
            multiple
            accept="image/*"
            beforeUpload={() => false}
            disabled
          >
            <Button icon={<UploadOutlined />} disabled>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="reply" label="Reply">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item>
  <div className="flex justify-end space-x-3">
    <Button type="primary" htmlType="submit">Reply Review</Button>
    <Button onClick={() => navigate("/admin/listreview")}>Cancel</Button>
  </div>
</Form.Item>

      </Form>
    </div>
  );
};

export default UpdateReview;
