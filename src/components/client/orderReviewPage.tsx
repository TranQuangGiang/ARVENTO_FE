import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import axiosInstance from '../../utils/axiosInstance';
import UpdateReview from './UpdateReview';


const OrderReviewPage = ({ orderId }:any) => {
    
    const { data: reviewsData, isLoading, error, refetch } = useQuery({
        queryKey: ['reviews', orderId],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await axiosInstance.get(`/reviews/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res?.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Lỗi khi tải dữ liệu: {error.message}</p>
            </div>
        );
    }

    if (!reviewsData || reviewsData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Không có đánh giá nào cho đơn hàng này.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 mt-7">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-center text-2xl font-bold text-gray-800">
                    Cập nhật đánh giá của bạn
                </h1>
                {/* Lặp qua mảng reviewsData để hiển thị form cho mỗi đánh giá */}
                {reviewsData.map((review: any) => (
                    <div key={review._id} className="mt-6">
                        <UpdateReview
                            initialReviewData={review}
                            onReviewUpdated={refetch} // refetch lại dữ liệu
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderReviewPage;