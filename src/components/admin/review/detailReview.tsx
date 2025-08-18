import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, Rate, message, Card, Spin } from 'antd';
import { useOneData } from '../../../hooks/useOne';
import axiosInstance from '../../../utils/axiosInstance';
import { FileImageOutlined } from '@ant-design/icons';

const DetailReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const { data: reviewData, isLoading, refetch } = useOneData({
        resource: '/reviews',
        _id: id,
    });

    useEffect(() => {
        if (reviewData?.data) {
            const { comment, images, rating, reply } = reviewData.data;

            // Chuyển đổi mảng URL ảnh sang định dạng fileList mà Upload component yêu cầu
            const formattedImages = images?.map((url:any, index:any) => ({
                uid: `${index}`,
                name: `image-${index}.png`,
                status: 'done',
                url: url,
            })) || [];
            form.setFieldsValue({
                comment: comment,
                rating: rating,
                reply: reply,
                images: formattedImages,
            });
            refetch();
        }
    }, [reviewData, form, refetch]);

    const onFinish = async (values:any) => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.put(
                `/reviews/admin/reviews/${id}/reply`,
                { reply: values.reply },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success("Phản hồi đánh giá thành công");
            refetch(); // Tải lại dữ liệu để cập nhật phản hồi mới
        } catch (error) {
            message.error("Phản hồi đánh giá thất bại");
        }
    };
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.delete(
                `/reviews/admin/reviews/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success("Xóa đánh giá thành công");
            navigate('/admin/listreview');
        } catch (error) {
            message.error("Xóa đánh giá thất bại");
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center"><Spin size="large" /></div>;
    }

    if (!reviewData?.data) {
        return <div className="p-6 text-center text-gray-500">Không tìm thấy dữ liệu đánh giá.</div>;
    }

    const { user_id, product_id } = reviewData.data;

    return (
        <div className="pt-10 pl-6 pr-6 bg-gray-50 min-h-screen">
            <h3 className="text-2xl font-semibold mb-1">Chi tiết đánh giá</h3>
            <p className="text-sm text-gray-500 mb-6">Thông tin chi tiết về đánh giá của khách hàng</p>
            <hr className="border-t border-gray-300 mb-6 -mt-3" />

            <Card className="shadow-md mb-6">
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item label="Khách hàng">
                            <Input value={user_id?.name || 'N/A'} disabled />
                        </Form.Item>
                        <Form.Item label="Sản phẩm">
                            <Input value={product_id?.name || 'N/A'} disabled />
                        </Form.Item>
                    </div>

                    <Form.Item name="rating" label="Xếp hạng">
                        <Rate disabled />
                    </Form.Item>

                    <Form.Item name="comment" label="Bình luận">
                        <Input.TextArea rows={4} disabled />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Ảnh đánh giá"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            listType="picture-card"
                            multiple
                            disabled
                        />
                            
                    </Form.Item>

                    <Form.Item name="reply" label="Phản hồi của quản trị viên">
                        <Input.TextArea rows={3} placeholder="Nhập phản hồi của bạn tại đây..." />
                    </Form.Item>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="primary" htmlType="submit">Gửi phản hồi</Button>
                        <Button onClick={() => navigate('/admin/listreview')}>Quay lại</Button>
                        <Button danger onClick={handleDelete}>Xóa đánh giá</Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default DetailReview;