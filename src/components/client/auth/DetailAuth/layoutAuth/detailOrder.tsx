import React from 'react';
import { useOneData } from '../../../../../hooks/useOne';
import { useParams } from 'react-router-dom';
import { Timeline } from 'antd';
import { useList } from '../../../../../hooks/useList';

const statusColorMap: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: 'Chờ xác nhận', color: 'orange', bg: 'bg-orange-100' },
  confirmed: { text: 'Đã xác nhận', color: 'blue', bg: 'bg-blue-100' },
  processing: { text: 'Đang xử lý', color: 'cyan', bg: 'bg-cyan-100' },
  shipping: { text: 'Đang giao hàng', color: 'purple', bg: 'bg-purple-100' },
  delivered: { text: 'Đã giao hàng', color: 'green', bg: 'bg-green-100' },
  completed: { text: 'Hoàn thành', color: 'green', bg: 'bg-green-100' },
  cancelled: { text: 'Đã huỷ', color: 'red', bg: 'bg-red-100' },
  returned: { text: 'Đã trả hàng', color: 'red', bg: 'bg-red-100' },
};

const DetailOrderClient = () => {
  const { id } = useParams();
  const { data: order } = useOneData({ resource: '/orders', _id: id });
  const detail = order?.data;
  console.log(detail);
  
  if (!detail) return null;

  const getStatusInfo = (status: string) =>
    statusColorMap[status] || { text: status, color: 'gray', bg: 'bg-gray-100' };
  return (
    <div className="max-w-5xl mx-auto p-5 bg-white shadow rounded-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-5 text-blue-600 border-b pb-2">🧾 Chi tiết đơn hàng</h2>

      <div className="grid md:grid-cols-2 gap-5 mb-6 text-sm text-gray-700">
        <div className="space-y-2">
          <p><strong>Mã đơn hàng:</strong> {detail._id}</p>
          <p><strong>Ngày đặt:</strong> {new Date(detail.created_at).toLocaleDateString()}</p>
          <p>
            <strong>Trạng thái:</strong>{' '}
            <span
              className={`ml-1 px-2 py-0.5 text-xs rounded-full font-medium text-${getStatusInfo(detail.status).color}-700 ${getStatusInfo(detail.status).bg}`}
            >
              {getStatusInfo(detail.status).text}
            </span>
          </p>
          <p><strong>Thanh toán :</strong> {detail.payment_method}</p>
          <p><strong>Ghi chú :</strong> {detail.note || 'Không có'}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold text-gray-800 mb-1">📦 Địa chỉ giao hàng</h3>
          <p><strong>Người nhận :</strong> {detail.address?.recipient}</p>
          <p><strong>Địa chỉ :</strong> {detail.address?.address}</p>
          <p><strong>SĐT :</strong> {detail.shipping_address?.phone}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold mb-2 text-gray-800">🛒 Sản phẩm</h3>
        <div className="divide-y">
          {detail.items.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-3">
              <div className="flex gap-4 items-center">
                <img
                  src={item.selected_variant?.image?.url || item.product?.images?.[0]?.url}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-md border"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} x {item.price?.toLocaleString()}₫
                  </p>
                </div>
              </div>
              <p className="text-[16px] font-semibold text-red-500">
                {(item.price * item.quantity).toLocaleString()}₫
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-right border-t pt-4 space-y-1 text-sm">
        <p>Tạm tính: <strong>{detail.subtotal.toLocaleString()}₫</strong></p>
        <p>Giảm giá: <strong className="text-green-600">- {detail.discount_amount.toLocaleString()}₫</strong></p>
        <p className="text-lg font-bold text-blue-600">Thành tiền: {detail.total.toLocaleString()}₫</p>
      </div>

      <div className="mt-8">
        <h3 className="text-base font-semibold mb-3 text-gray-800">📍 Lịch sử cập nhật</h3>
        <Timeline>
          {detail.timeline?.map((item: any, idx: number) => (
            <Timeline.Item
              key={idx}
              color={statusColorMap[item.status]?.color || 'gray'}
              label={new Date(item.changedAt).toLocaleString()}
            >
              {statusColorMap[item.status]?.text || item.status}
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default DetailOrderClient;
