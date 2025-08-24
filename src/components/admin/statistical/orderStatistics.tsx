import React, { useEffect, useState } from 'react'
import { useList } from '../../../hooks/useList'
import { Spin, Typography } from 'antd';
import { 
    Cell, 
    Pie, 
    PieChart, 
    ResponsiveContainer, 
    Tooltip 
} from 'recharts';

const { Title } = Typography;
// Interface cho cấu trúc dữ liệu nhận được từ API
interface OrderStatusData {
  status: string;
  count: number;
}
// Interface cho dữ liệu sau khi xử lý để hiển thị trên biểu đồ
interface ChartData {
  name: string;
  value: number;
  originalStatus: string
}
const CharOrderStatistics = () => {
    const { data: apiData, isLoading, refetch } = useList({
        resource: `/dashboard/orders/status`
    });
    console.log(apiData);
    
    const [chartData, setChartData] = useState<ChartData[]>([]);

    // Định nghĩa màu sắc cho từng trạng thái
    const statusColors: Record<string, string> = {
        pending: "#faad14",   // vàng cam
        confirmed: "#1677ff", // xanh dương
        processing: "#13c2c2", // xanh ngọc
        shipping: "#722ed1",  // tím
        delivered: "#2f54eb", // xanh đậm hơn
        completed: "#52c41a", // xanh lá
        cancelled: "#ff4d4f", // đỏ
        returning: "#ffc53d", // vàng cam nhạt
        returned: "#d46b08",  // cam đất
    };

    const statusLabels: Record<string, string> = {
        shipping: 'Đang giao hàng',
        completed: 'Hoàn thành',
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        cancelled: 'Hủy đơn',
        returning: 'Đang trả hàng',
        delivered: 'Đã giao hàng',
        returned: 'Đã trả hàng',
        processing: 'Đang xử lý' // Thêm nếu có trạng thái này
    };

    useEffect(() => {
        if (apiData && Array.isArray(apiData.data)) {
            // Chuyển đổi dữ liệu từ API sang định dạng phù hợp cho Recharts
            const transformedData: ChartData[] = apiData.data.map((item: OrderStatusData) => ({
                name: statusLabels[item.status] || item.status,
                value: item.count,
                originalStatus: item.status
            }));
            setChartData(transformedData);
        }
    }, [apiData]);

    // Hiển thị loading spinner khi dữ liệu đang được tải
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white p-6 rounded-lg shadow-md">
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    // Hiển thị thông báo nếu không có dữ liệu
    if (!chartData || chartData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-64 flex items-center justify-center">
                <p className="text-gray-500">Không có dữ liệu trạng thái đơn hàng để hiển thị.</p>
            </div>
        );
    }
    return (
        <div className='bg-white p-6 rounded-lg shadow-md w-full'>
            <Title level={3} className='text-center mb-4'>Thống kê đơn hàng theo trạng thái</Title>
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx = "50%"
                        cy = "50%"
                        labelLine={false}
                        outerRadius={100} // Bán kính ngoài của biểu đồ
                        fill="#8884d8"
                        dataKey="value" // Khóa dữ liệu cho giá trị (số lượng)
                        nameKey="name"  // Khóa dữ liệu cho tên (trạng thái)
                        className='text-[13px]'
                        label={({ name, percent }:any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {
                            chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={statusColors[entry.originalStatus] || '#CCCCC'} />
                            ))
                        }
                    </Pie>
                    {/* Tooltip hiển thị thông tin khi di chuột vào lát cắt */}
                    <Tooltip formatter={(value: number, name: string) => [`${value} đơn`, name]}></Tooltip>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CharOrderStatistics