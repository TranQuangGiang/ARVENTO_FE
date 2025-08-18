import { Form, Input, Button, Upload, Rate, Select, message } from "antd";
import { data, useNavigate, useParams } from "react-router-dom";
import { useOneData } from "../../../hooks/useOne";
import axiosInstance from "../../../utils/axiosInstance";
import { useEffect } from "react";

const ReplyReview = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const nav = useNavigate();

  const { data: review, refetch } = useOneData({ resource: `/reviews`, _id: id });
  useEffect(() => {
    if (review?.data) {
      const formattedImages = review?.data.images?.map((url:any, index:any) => ({
        uid: `${index}`, // uid phải là duy nhất
        name: `image-${index}.png`,
        status: 'done',
        url: url,
      })) || [];
      form.setFieldsValue({
        ...review?.data,
        images: formattedImages,
      });
      refetch();
    }
  }, [review, id])
  const onFinish = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.put(`/reviews/admin/reviews/${id}/reply`, 
        {
          reply: values.reply
        },
        {
          headers: {
            Authorization:  `Bearer ${token}`
          }
        }
      )
      message.success("Phản hồi đánh giá thành công");
      nav('/admin/listreview');
      await refetch();
    } catch (error) {
      message.error("Phản hồi đánh giá thất bại")
    }
  };


  return (
    <div className="pt-10 pl-6 pr-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-semibold mb-1">Phản hồi đánh giá</h3>
      <p className="text-sm text-gray-500 mb-6">Phản hồi đánh giá người dùng</p>
      <hr className="border-t border-gray-300 mb-6 -mt-3" />

      <Form layout="vertical" onFinish={onFinish} form={form} className="space-y-4">
        <Form.Item label="Khách hàng">
          <Input value={review?.data?.user_id?.name} disabled />
        </Form.Item>

        <Form.Item label="Tên sản phẩm">
          <Input value={review?.data?.product_id?.name} disabled />
        </Form.Item>

        <Form.Item name="rating" label="Xếp hạng">
          <Rate disabled  />
        </Form.Item>

        <Form.Item name="comment" label="Đánh giá">
          <Input.TextArea rows={3} disabled />
        </Form.Item>

        <Form.Item
          name="images"
          label="Ảnh đánh giá"
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
          /> 
        </Form.Item>

        <Form.Item name="reply" label="Phản hồi">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-3">
            <Button type="primary" htmlType="submit">Phản hồi </Button>
            <Button onClick={() => navigate("/admin/listreview")}>Hủy</Button>
          </div>
        </Form.Item>

      </Form>
    </div>
  );
};

export default ReplyReview;
