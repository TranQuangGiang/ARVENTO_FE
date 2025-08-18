import { CameraOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, message, Rate, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { useOneData } from '../../hooks/useOne';
import axios from 'axios';

const desc = ['Rất Tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

const UpdateReview = ({
    onCLose,
    rewiewId
}:any) => {
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
     const [ratingValue, setRatingValue] = useState(0);

    const rewiewID = rewiewId
    console.log("ID đánh giá", rewiewID);

    const { data:reviewData, refetch:isReviewRefetch } = useOneData({
        resource: `/reviews`,
        _id: rewiewID
    });
    console.log(reviewData);
    useEffect(() => {
        
        if (reviewData?.data) {
            const { comment, images, rating } = reviewData.data;
            setRatingValue(rating);

            const formattedImages = images?.map((url:any, index:any) => ({
                uid: `${index}`,
                name: `image-${index}.png`,
                status: 'done',
                url: url,
            })) || [];

            form.setFieldsValue({
                comment: comment,
                rating: rating,
                images: formattedImages,
            });
            isReviewRefetch();
        }
    }, [reviewData, form]);


    if (!reviewData?.data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Không tìm thấy đánh giá để cập nhập.</p>
            </div>
        );
    }

    const token = localStorage.getItem("token");
    const handleUpdateReview = async (values:any) => {
        
        const formData = new FormData();
        formData.append('rating', values.rating);
        formData.append('comment', values.comment);
        
        values.images.forEach((file:any) => {
            if (file.originFileObj) {
                
                formData.append('images', file.originFileObj);
            } else if (file.url) {
                
                formData.append('images', file.url);
            }
        });
        setLoading(true);
        try {
           
            await axios.put(`http://localhost:3000/api/reviews/${rewiewId}`, formData, 
                { 
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            message.success("Cập nhập phản hồi thành công");
            if (onCLose) {
                onCLose();
            }
            isReviewRefetch();
        } catch (error:any) {
            message.error("Cập nhập thất bại: ", error?.data?.message);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 mt-7">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-center text-2xl font-bold text-gray-800">
                    Cập nhập đánh giá của bạn 
                </h1>
                <div className="border border-gray-200 rounded-[10px] p-6 bg-white shadow-sm mt-6">
                    <div className="flex flex-col gap-4 items-start w-full mt-7 px-2">
                        <div className="w-full">
                            <h3 className="font-semibold text-gray-700 mb-2">Đánh giá của bạn</h3>
                            <Form form={form} onFinish={handleUpdateReview}>
                                <Form.Item
                                    className="w-full mt-3"
                                    name="rating"
                                    rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                                >
                                    <div className="flex w-full flex-col">
                                        {/* Hàng sao */}
                                        <div className="flex w-full">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div key={star} className="flex-1 flex justify-center">
                                                    <Rate
                                                        count={1} // mỗi Rate chỉ có 1 ngôi sao
                                                        value={ratingValue >= star ? 1 : 0}
                                                        onChange={() => {
                                                            setRatingValue(star);
                                                            form.setFieldsValue({ rating: star }); // cập nhật giá trị vào form
                                                        }}
                                                        className="text-2xl"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Hàng label */}
                                        <div className="flex w-full mt-1 text-[14px] text-gray-600">
                                            {desc.map((label, idx) => (
                                                <span key={idx} className="flex-1 text-center">
                                                {label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Form.Item>
                            
                                <Form.Item name="comment">
                                    <TextArea
                                        rows={4}
                                        placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm..."
                                        className="w-full"
                                        
                                    />
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
                                <Form.Item
                                    className="w-full text-right"
                                > 
                                    <Button
                                        icon={<SendOutlined />}
                                        style={{
                                            backgroundColor: "#1e3a8a",
                                            borderColor: "#1e3a8a",
                                            color: "white",
                                        }}
                                        
                                        htmlType='submit'
                                        className="cursor-pointer hover:shadow-lg"
                                    >
                                        Cập nhập đánh giá
                                    </Button>
                                </Form.Item>
                            </Form>
                        
                        
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateReview