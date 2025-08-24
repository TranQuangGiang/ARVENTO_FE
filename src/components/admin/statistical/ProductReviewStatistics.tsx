import React, { useEffect } from 'react';
import { useList } from '../../../hooks/useList';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const ProductReviewStatistics = () => {
    const { data, refetch } = useList({
        resource: `/reviews/admin/reviews/dashboard`
    });

    useEffect(() => {
        if (data?.data) {
            console.log("Reviews: ", data.data);
        }
    }, [data]);

    if (!data?.data) {
        return <div className="p-6 text-center">Đang tải dữ liệu...</div>;
    }

    const { monthly, byRating } = data.data;

    // --- Xử lý dữ liệu cho biểu đồ cột (BarChart) ---
    const monthlyChartData = monthly.map((item: any) => ({
        month: `Tháng ${item.month.slice(5)}`,
        year: item.month.slice(0, 4),
        reviews: item.total,
    }));

    // --- Xử lý dữ liệu cho biểu đồ tròn (PieChart) ---
    const ratingChartData = Object.entries(byRating).map(([rating, count]) => ({
        name: `${rating} sao`,
        value: count as number,
    }));

    // Màu sắc cho biểu đồ tròn, sử dụng bảng màu hiện đại hơn
    const COLORS = ['#FF6B6B', '#FFD166', '#4ECDC4', '#1A535C', '#00A3B0'];

    // Tính tổng số đánh giá để hiển thị ở trung tâm biểu đồ tròn
    const totalReviews = ratingChartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className='bg-gray-100 min-h-screen mt-10'>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full mx-auto">
                <h1 className="text-[20px] font-bold text-center text-gray-800 mb-8">📊 Thống kê Đánh giá Sản phẩm</h1>
                
                <div className="flex w-full gap-8 items-center">
                    {/* Biểu đồ theo tháng (BarChart) */}
                    <div className="w-[60%] bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Thống kê đánh giá theo tháng</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData}>
                                    <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
                                    <YAxis tick={{ fill: '#6B7280' }} />
                                    <Tooltip
                                        formatter={(value: any, name: any, props: any) => [`Số lượng: ${value}`, `${props.payload.month}/${props.payload.year}`]}
                                        labelFormatter={() => ''}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="reviews" fill="#6366F1" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Biểu đồ theo xếp hạng (PieChart) */}
                    <div className="w-[40%] bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Tỷ lệ đánh giá theo xếp hạng</h3>
                        <div className="relative h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ratingChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        innerRadius={60} // Tạo hiệu ứng donut chart
                                        label={({ name, percent }:any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {ratingChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any, name: any) => [`Số lượng: ${value}`]}
                                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                    />
                                    <Legend wrapperStyle={{ bottom: -20 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute text-center">
                                <p className="text-xl font-bold text-gray-800">{totalReviews}</p>
                                <p className="text-sm text-gray-500">Tổng đánh giá</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần chi tiết dạng danh sách */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Chi tiết số liệu</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-md font-semibold text-gray-600 mb-2">Số lượng đánh giá theo tháng</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {monthly.map((item: any) => (
                                    <li key={item.month}>
                                        <span className="text-gray-700">Tháng {item.month.slice(5)}/{item.month.slice(0, 4)}: </span>
                                        <strong className="text-indigo-600">{item.total}</strong> đánh giá
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-md font-semibold text-gray-600 mb-2">Số lượng đánh giá theo xếp hạng</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {Object.entries(byRating).map(([rating, count]: any) => (
                                    <li key={rating}>
                                        <span className="text-gray-700">{rating} sao: </span>
                                        <strong className="text-indigo-600">{count}</strong> đánh giá
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviewStatistics;