import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState, useMemo } from 'react';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Alert, DatePicker, Select, Spin } from 'antd';
import { useList } from '../../../hooks/useList';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';



dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Option } = Select;

interface RevenueData {
  date: string; 
  revenue: number;
}

interface ProcessedRevenueData {
    date: string,
    revenue: number,
}

type GroupByOption = 'day' | 'month' | 'year';

const RevenueChart = () => {
    const [ dateRange, setDateRange ] = useState<[ Dayjs | null, Dayjs | null ]>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [groupBy, setGroupBy] = useState<GroupByOption>('day');
    const [data, setData] = useState<ProcessedRevenueData[]>([]);
    const [error, setError] = useState<string | null>(null);
   
    const revenueApiUrl = useMemo(() => {
        let url = '/dashboard/revenue?'
        const params: string[] = [];

        const [ from, to ] = dateRange;

        // xử lý from
        if (from) {
            params.push(`from=${from.format('YYYY-MM-DD')}`);
        }

        // xử lý to
        if (to) {
            params.push(`to=${to.add(1, 'day').format('YYYY-MM-DD')}`);
        }

        if (groupBy && groupBy !== 'day') {
            params.push(`groupBy=${groupBy}`)
        }

        if (params.length > 0) {
            url += params.join('&');
        }

        console.log("API URL (Frontend): ", url);
        return url
    }, [dateRange, groupBy]);
    
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
            setData([]);
            return;
        }

        if (chartDataResponse && Array.isArray(chartDataResponse.data)) {
            try {
                let rawDataFromApi: RevenueData[] = chartDataResponse.data;
                let processedData: ProcessedRevenueData[] = [];

                const isBackendAggregated  = rawDataFromApi.length > 0 && 
                                            (groupBy === 'month' && dayjs(rawDataFromApi[0].date, 'YYYY-MM', true).isValid()) ||
                                            (groupBy === 'year' && dayjs(rawDataFromApi[0].date, 'YYYY', true).isValid());
                if (groupBy === 'day' || !isBackendAggregated) {
                    if (groupBy === 'day') {
                        processedData = rawDataFromApi;
                    } else if (groupBy === 'month') {
                        const monthlyDataMap = new Map<string, number>();
                        rawDataFromApi.forEach((item: RevenueData) => {
                            const monthKey = dayjs(item.date).format('YYYY-MM');
                            monthlyDataMap.set(monthKey, (monthlyDataMap.get(monthKey) || 0) + item.revenue);
                        });
                        processedData = Array.from(monthlyDataMap.entries())
                            .map(([date, revenue]) => ({ date, revenue  }))
                            .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
                    } else if (groupBy === 'year') {
                        const yearlyDataMap = new Map<string, number>();
                        rawDataFromApi.forEach((item: RevenueData) => {
                        // Lấy YYYY từ YYYY-MM-DD (hoặc YYYY nếu BE đã tổng hợp rồi nhưng chúng ta xử lý lại cho chắc)
                        const yearKey = dayjs(item.date).format('YYYY');
                        yearlyDataMap.set(yearKey, (yearlyDataMap.get(yearKey) || 0) + item.revenue);
                        });
                        processedData = Array.from(yearlyDataMap.entries())
                        .map(([date, revenue]) => ({ date, revenue }))
                        .sort((a, b) => parseInt(a.date) - parseInt(b.date));
                    }
                }
                else {
                    // Nếu Backend đã tổng hợp đúng định dạng (ví dụ: date là YYYY-MM cho tháng)
                    processedData = rawDataFromApi;
                }

                setData(processedData);
                setError(null);
            } catch (error) {
                setError('Lỗi khi xử lý dữ liệu doanh thu.');
                console.error('Error processing chart data:', error);
                setData([]);
            }
        } else if (!chartDataResponse || chartDataResponse.data === null || chartDataResponse.data.length === 0) {
            setData([]);
            setError('Không có dữ liệu doanh thu cho khoảng thời gian đã chọn.');

        }
    }, [chartDataResponse, isLoading, isError, fetchError, groupBy]);

    useEffect(() => {
        refetch();
    }, [revenueApiUrl, refetch]);

    const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        setDateRange(dates || [null, null]);
    };

    const handleGroupByChange = (value: GroupByOption) => {
        setGroupBy(value);
    };

    const xAxisTickFormatter = (tick: string) => {
        if (groupBy === 'month') {
        // Dù dữ liệu được tổng hợp ở FE hay BE, nó sẽ ở định dạng YYYY-MM
        return dayjs(tick, 'YYYY-MM').format('MM/YYYY');
        }
        if (groupBy === 'year') {
        // Dù dữ liệu được tổng hợp ở FE hay BE, nó sẽ ở định dạng YYYY
        return dayjs(tick, 'YYYY').format('YYYY');
        }
        // Mặc định là 'day', dữ liệu luôn là 'YYYY-MM-DD'
        return dayjs(tick, 'YYYY-MM-DD').format('DD/MM');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-full">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-[16px] font-semibold">
                    Doanh thu 
                    {dateRange[0] && dateRange[1] && 
                        ` từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`
                    }
                    {!dateRange[0] && dateRange[1] && `up to ${dateRange[1].format('DD/MM/YYYY')}`}
                    {dateRange[0] && !dateRange[1] && ` from ${dateRange[0].format('DD/MM/YYYY')}`}
                    {!dateRange[0] && !dateRange[1] && ` (All time)`}
                </h2>
                <div className='flex gap-2 items-center f'>
                    <span className='text-sm whitespace-nowrap'>Chọn thời gian:</span>
                    <RangePicker 
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="YYYY-MM-DD"
                        className='border text-[14px] px-1.5 py-1 rounded'
                    />
                    <span className='text-sm whitespace-nowrap ml-4'>Nhóm theo: </span>
                    <Select
                        value={groupBy}
                        onChange={handleGroupByChange}
                        className='w-[30%]'
                        placeholder="Group By"
                    >
                        <Option value="day">Ngày</Option>
                        <Option value="month">Tháng</Option>
                        <Option value="year">Năm</Option>
                    </Select>
                </div>
            </div>

            { isLoading ? (
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
                    <p className="text-gray-500">Không có dữ liệu doanh thu cho khoảng thời gian đã chọn.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={500}>
                    { groupBy === 'day' ? (
                        <LineChart data={data} >
                            <CartesianGrid strokeDasharray=" 3 3" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={xAxisTickFormatter}
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
                            <Tooltip 
                                formatter={(value: number, name: string, props) => {
                                    const dateKey = props.payload?.date;
                                    let formattedDate = '';
                                    if (dateKey) {
                                        formattedDate = dayjs(dateKey, 'YYYY-MM-DD').format('DD/MM/YYYY');
                                    }
                                    return [`${value.toLocaleString()} VNĐ`, `Doanh Thu ${formattedDate}`];
                                }}
                            />
                            <Line type='monotone' dataKey='revenue' stroke="#09ad95" strokeWidth={2} dot={{ stroke: '#09ad95', fill: '#09ad95' }} />
                            
                        </LineChart>
                    ) : (
                        <BarChart 
                            data = {data}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={xAxisTickFormatter} />
                            <YAxis
                                className="text-[16px]"
                                tickFormatter={(v) => {
                                    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
                                    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                                    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
                                    return `${v}`;
                                }}
                            />
                            <Tooltip 
                                formatter={(value: number, name: string, props) => {
                                    const dateKey = props.payload?.date;
                                    let formattedDate = '';
                                    if (dateKey) {
                                        if (groupBy === 'month') {
                                            formattedDate = dayjs(dateKey, 'YYYY-MM').format('MM/YYYY');
                                        } else if (groupBy === 'year') {
                                            formattedDate = dayjs(dateKey, 'YYYY').format('YYYY');
                                        }
                                    }
                                    return [`${value.toLocaleString()} VNĐ`, `Doanh Thu ${formattedDate}`];
                                }}
                            />
                            <Bar dataKey='revenue' fill='#09ad95' />
                        </BarChart>
                    )}
                    
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default RevenueChart;