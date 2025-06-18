import { Info } from 'lucide-react'
import React from 'react'

const HomeAuth = () => {
  return (
    <div className='w-full'>
        <div className='w-full h-14 border border-blue-500 rounded-[7px] flex items-center mb-3 bg-[#ebf3fe]'>
            <span className='w-full flex items-center justify-between'>  
                <p className='flex text-[15px] ml-4 items-center font-medium'><Info className='mr-2 text-blue-600' style={{width: 20}} /> Thêm địa chỉ để đặt hàng nhanh hơn </p>
                <p className='text-[15px] mr-7 font-medium cursor-pointer text-blue-500'>Thêm địa chỉ</p>
            </span>
            
        </div>
        <div className='w-full flex items-center'>
            <div className='w-3/4 relative h-[250px] bg-white rounded-[15px] '>
                <h4 className='absolute top-4 text-[17px] font-semibold left-4'>Đơn hàng gần đây</h4>
                <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                    <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                    {/* Nội dung ở phía trên */}
                    <span className="relative z-10 w-full flex flex-col items-center">
                        <img className="w-[170px]" src="/cartD.png" alt="" />
                    </span>
                    <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có đơn hàng nào gần đây? Hãy bắt đầu mua sắm ngay nào!</p>
                </div>
            </div>
            <div className='w-1/4 relative bg-white ml-3 h-[250px] rounded-[15px]'>
                <h4 className='absolute top-4 text-[17px] font-semibold left-4'>Ữu đãi của bạn </h4>
                <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                    <div className="absolute w-[170px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                    {/* Nội dung ở phía trên */}
                    <span className="relative z-10 w-full flex flex-col items-center">
                        <img className="w-[170px]" src="/voucher.png" alt="" />
                    </span>
                    <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có ưu đãi nào ?</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HomeAuth