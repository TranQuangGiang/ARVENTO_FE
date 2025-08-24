import React, { useEffect, useState, useMemo } from 'react';
import { useList } from '../../../hooks/useList';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs
import 'dayjs/locale/vi';
import { DatePicker, ConfigProvider , Spin, Alert } from 'antd'; // Chỉ cần DatePicker, Spin, Alert
import viVN from 'antd/locale/vi_VN';

dayjs.locale('vi');
const { RangePicker } = DatePicker;

interface RevenueData {
  date: string; 
  revenue: number;
}

const Chart = () => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [data, setData] = useState<RevenueData[]>([]);
  // Trạng thái lỗi (nếu có)
  const [error, setError] = useState<string | null>(null);


  const revenueApiUrl = useMemo(() => {
    let url = `/dashboard/revenue?`;
    const params: string[] = [];
    const [from, to] = dateRange;
    
    if (from) {
      params.push(`from=${from.format('YYYY-MM-DD')}`)
    }
    if (to) {
      params.push(`to=${to.add(1, 'day').format('YYYY-MM-DD')}`)
    }

    if (params.length > 0) {
      url += params.join('&');
    }
    return url;
    
  }, [dateRange]); 

  const {
    data: chartDataResponse,
    refetch,
    isLoading,
    isError,
    error: fetchError,
  } = useList({
    resource: revenueApiUrl, 
  });

  useEffect(() => {
    if (isLoading) {
      setError(null);
      return;
    }

    if (isError) {
      setError('Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.');
      console.error('Error fetching revenue data:', fetchError);
      setData([]);
      return;
    }

    if (chartDataResponse && chartDataResponse.data) {
      try {
        if (Array.isArray(chartDataResponse.data)) {
          const sortedData = [...chartDataResponse.data].sort((a, b) => 
            dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
          );
          setData(sortedData);
          setError(null);
        } else {
          setError('Dữ liệu trả về không đúng định dạng.');
          console.error('API response data is not an array:', chartDataResponse.data);
          setData([]);
        }
      } catch (err) {
        setError('Lỗi khi xử lý dữ liệu doanh thu.');
        console.error('Error processing chart data:', err);
        setData([]);
      }
    } else if (!chartDataResponse) {
      setData([]);
      setError('Không có dữ liệu doanh thu cho ngày đã chọn.');
    }
  }, [chartDataResponse, isLoading, isError, fetchError]);

  useEffect(() => {
    refetch();
  }, [revenueApiUrl, refetch]);


  const handleDateRangeChange  = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates || [null, null]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        {/* Tiêu đề hiển thị ngày được chọn */}
        <h2 className="text-[16px] font-semibold">
          Doanh thu từ {' '}
          {dateRange[0] && dateRange[1] ?
            `${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}` :
            'chưa chọn'
          }
        </h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm">Chọn ngày:</span>
          <ConfigProvider locale={viVN}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              className="border text-[14px] h-[40px] px-1.5 py-1 rounded"
            />
          </ConfigProvider> 
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Spin size="large" />
          <p className="ml-2 text-gray-500">Đang tải biểu đồ doanh thu...</p>
        </div>
      ) : error ? (
        <div className="h-[300px] flex justify-center items-center">
          <Alert message="Lỗi" description={error} type="error" showIcon />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex justify-center items-center">
          <p className="text-gray-500">Không có dữ liệu doanh thu cho ngày đã chọn</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={310}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              // Định dạng trục X chỉ hiển thị ngày (vd: 31/07) hoặc không hiển thị nếu chỉ có 1 điểm
              tickFormatter={(tick) => dayjs(tick).format('DD/MM')}
            />
            <YAxis 
              className="text-[16px]" 
              tickFormatter={(v) => {
                if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
                return `${v}`;
              }} 
            />
            <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} />
            <Line type="monotone" dataKey="revenue" stroke="#09ad95" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;