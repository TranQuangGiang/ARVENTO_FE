import React from 'react'

const DiscountCode = () => {
  return (
    <div className='w-full'>
        <div className='w-full relative h-60 rounded-[15px] bg-white'>
            <h4 className='pt-4 absolute text-[17px] font-[Product Sans] font-bold ml-5 z-20'>Ữu đãi của bạn</h4>
            <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                {/* Nội dung ở phía trên */}
                <span className="relative z-10 w-full flex flex-col items-center">
                    <img className="w-[170px]" src="/cartD.png" alt="" />
                </span>
                <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có ưu đãi nào!</p>
            </div>
        </div>
    </div>
  )
}

export default DiscountCode