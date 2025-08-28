import { CameraOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, message, Rate, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import axios from 'axios';


const desc = ['Rất Tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

const UpdateReviewForm = ({ initialReviewData, onReviewUpdated }: any) => {
    const [form] = Form.useForm();
    const [ratingValue, setRatingValue] = useState(initialReviewData.rating);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRatingValue(initialReviewData.rating);
        
        const formattedImages = initialReviewData.images?.map((url: any, index: any) => ({
            uid: `${index}`,
            name: `image-${index}.png`,
            status: 'done',
            url: url,
        })) || [];

        form.setFieldsValue({
            comment: initialReviewData.comment,
            rating: initialReviewData.rating,
            images: formattedImages,
        });
    }, [initialReviewData, form]);
    
    const handleUpdateReview = async (values: any) => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('rating', values.rating);
        formData.append('comment', values.comment);

        values.images.forEach((file: any) => {
            if (file.originFileObj) {
                formData.append('images', file.originFileObj);
            } else if (file.url) {
                formData.append('images', file.url);
            }
        });

        try {
            await axios.put(`http://localhost:3000/api/reviews/${initialReviewData._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            message.success("Cập nhật đánh giá thành công!");
            if (onReviewUpdated) {
                onReviewUpdated();
            }
        } catch (error: any) {
            message.error("Cập nhật thất bại: ", (error?.response?.data?.message || "Lỗi không xác định"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="border border-gray-200 rounded-[10px] p-6 bg-white shadow-sm mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">
                Đánh giá sản phẩm: {initialReviewData.product_id.name}
            </h3>
            <Form form={form} onFinish={handleUpdateReview}>
                <Form.Item
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                >
                    <div className="flex w-full flex-col">
                        <div className="flex w-full">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="flex-1 flex justify-center">
                                    <Rate
                                        count={1}
                                        value={ratingValue >= star ? 1 : 0}
                                        onChange={() => {
                                            setRatingValue(star);
                                            form.setFieldsValue({ rating: star });
                                        }}
                                        className="text-2xl"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full mt-1 text-[14px] text-gray-600">
                            {desc.map((label, idx) => (
                                <span key={idx} className="flex-1 text-center">{label}</span>
                            ))}
                        </div>
                    </div>
                </Form.Item>

                <Form.Item name="comment">
                    <TextArea rows={4} placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm..." />
                </Form.Item>

                <Form.Item
                    name="images"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    className="w-full flex justify-between items-center gap-4"
                >
                    <Upload
                        listType="picture-card"
                        maxCount={3}
                        beforeUpload={() => false}
                        multiple
                    >
                        <div className="text-sm flex flex-col items-center">
                            <CameraOutlined />
                            <div className="mt-1">Thêm ảnh</div>
                        </div>
                    </Upload>
                </Form.Item>

                <Form.Item className="w-full text-right">
                    <Button
                        icon={<SendOutlined />}
                        style={{
                            backgroundColor: "#1e3a8a",
                            borderColor: "#1e3a8a",
                            color: "white",
                        }}
                        htmlType='submit'
                        className="cursor-pointer hover:shadow-lg"
                        loading={loading}
                    >
                        Cập nhật đánh giá
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateReviewForm;