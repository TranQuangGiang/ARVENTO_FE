import React from 'react'
import { Link } from 'react-router-dom'
import { useList } from '../../../../../hooks/useList'

const DiscountCode = () => {
  const { data } = useList({
    resource: `/coupons/available`
  });

  // Giao diện khi không có mã giảm giá
  const NoDiscountUI = (
    <div className='w-full relative h-60 rounded-[15px] bg-white'>
      <div className='pt-4 w-full absolute flex items-center justify-between z-30'>
        <h4 className='text-[17px] font-[Product Sans] font-bold ml-5 z-20'>Ưu đãi của bạn</h4>
        <Link to={`/`}>
          <p className='mr-5 text-[15px] font-[Product Sans] font-semibold cursor-pointer z-40'>Danh sách voucher đã dùng</p>
        </Link>
      </div>
      <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
        <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
        <span className="relative z-10 w-full flex flex-col items-center">
          <img className="w-[170px]" src="/cartD.png" alt="" />
        </span>
        <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có ưu đãi nào!</p>
      </div>
    </div>
  );

  // Giao diện khi có mã giảm giá
  const DiscountListUI = (
    <div className='w-full relative min-h-[240px] bg-transparent pt-16 px-5'>
      {data?.data.map((coupon: any) => (
        <div
          key={coupon._id}
          className="relative flex bg-white rounded-lg border border-orange-400 shadow-sm overflow-hidden mb-5 coupon-card"
        >
          {/* Vạch trái - màu thương hiệu */}
          <div className="w-2 bg-gradient-to-b from-orange-400 to-orange-600 rounded-l-md" />

          {/* Vùng trái - nội dung voucher */}
          <div className="flex-1 px-4 py-3">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Mã giảm giá</p>
            <h2 className="text-xl font-extrabold text-gray-800 mt-1">{coupon.code}</h2>
            <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
            <p className="text-xs text-gray-400 mt-2">HSD: <span className="text-red-500 font-semibold">{new Date(coupon.expiryDate).toLocaleDateString()}</span></p>
          </div>

          {/* Vùng phải - hiển thị giá trị giảm */}
          <div className="w-[120px] flex flex-col justify-center items-center bg-orange-50 border-l border-dashed border-orange-300 px-2">
            <span className="text-sm text-gray-600">Giảm đến</span>
            <span className="text-2xl font-bold text-orange-500">
              {coupon.discountType === "percentage"
                ? `-${coupon.discountValue}%`
                : `-${coupon.discountValue.toLocaleString()}₫`}
            </span>
          </div>

          {/* Hiệu ứng răng cưa hai bên */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[-10px] w-5 h-5 rounded-full bg-white border-2 border-dashed border-orange-300 z-10" />
          <div className="absolute top-1/2 -translate-y-1/2 right-[-10px] w-5 h-5 rounded-full bg-white border-2 border-dashed border-orange-300 z-10" />
        </div>
      ))}
    </div>
  );

  return (
    <div className='w-full'>
      <div className='w-full relative min-h-[240px] rounded-[15px] bg-white'>
        <div className='pt-4 w-full absolute flex items-center justify-between z-30'>
          <h4 className='text-[17px] font-[Product Sans] font-bold ml-5 z-20'>Ưu đãi của bạn</h4>
          <Link to={`/`}>
            <p className='mr-5 text-[15px] font-[Product Sans] font-semibold cursor-pointer z-40'>Danh sách voucher đã dùng</p>
          </Link>
        </div>
        
        {/* Sử dụng toán tử ba ngôi để hiển thị giao diện */}
        {data?.data?.length === 0 ? NoDiscountUI : DiscountListUI}

      </div>
    </div>
  );
};

export default DiscountCode;