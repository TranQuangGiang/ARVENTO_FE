import { MapPin, Receipt, ScrollText, ShoppingBag, Tickets } from 'lucide-react'
import React from 'react'

const DetailAuth = () => {
    return (
        <main className='w-full m-0 h-screen flex flex-col items-center bg-[#e4e4e7]'>
            <div className='mt-[20px] w-[90%] mx-auto flex items-center gap-5 h-[140px] bg-white rounded-[15px]'>
                <div className='flex items-center gap-3.5 ml-8 w-1/3'>
                    <span className='w-[75px] h-[75px] flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                        <img className='w-14 h-14' src="/tho.png" alt="" />
                    </span>
                    <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                        <h2>Trần Quang Giang</h2>
                        <p className='text-[15px] font-sans text-gray-800'>quang***********@gmail.com</p>
                    </span>
                </div>
                <div className='flex items-center flex-col h-full'>
                    <div className='flex items-center h-[65%]'>
                        <span className='border-[2px] rounded h-[85%] border-blue-500'></span>
                        <div className='flex items-center gap-3.5 ml-8'>
                            <span className='w-12 h-12 flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                                <ShoppingBag className='text-blue-950' />
                            </span>
                            <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                                <h2>0</h2>
                                <p className='text-[16px] font-sans text-gray-800'>Tổng số đơn hàng đã mua</p>
                            </span>
                        </div>
                        <span className='border-[2px] ml-14 rounded h-[85%] border-blue-500'></span>
                        <div className='flex items-center gap-3.5 ml-8'>
                            <span className='w-12 h-12 flex flex-col items-center justify-center rounded-[50%] bg-gradient-to-b from-white to-blue-200'>
                                <Receipt className='text-blue-950' />
                            </span>
                            <span className='[&_h2]:font-bold [&_h2]:uppercase [&_h2]:font-sans [&_h2]:text-[18px]'>
                                <h2>0 đ</h2>
                                <p className='text-[16px] font-sans text-gray-800'>Tổng tiền tích lũy </p>
                            </span>
                        </div>
                    </div>
                    <div className='mt-1.5 ml-6 w-xl flex items-center h-8 rounded-[12px] bg-[#f4f4f7]'>
                        <span className='flex items-center pl-2'>
                            <ScrollText width={16} color='#000' />
                            <p className='text-[13px] ml-2 text-black font-sans'>Tổng tiền và số đơn hàng được tính chung từ ARVENTO</p>
                        </span>
                    </div>
                </div>
            </div>    
            <div className='w-[90%] mx-auto h-[80px] rounded-[15px] bg-white mt-4'>
                <nav className='w-[95%] mx-auto h-full flex items-center gap-12'>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <Tickets style={{width: 20, color: "#162456"}}/>
                        </span>
                        <p className='text-[15px] ml-3 text-blue-950'> Mã giảm giá</p>
                    </span>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <ScrollText style={{width: 20, color: "#162456"}}/>
                        </span>
                        <p className='text-[15px] ml-3 text-blue-950'> Lịch sử đơn hàng</p>
                    </span>
                    <span className='flex items-center cursor-pointer'>
                        <span className='w-10 h-10 flex items-center justify-center rounded-[50%] bg-[#f7f7f8]'>
                            <MapPin style={{width: 20, color: "#162456"}}/>
                        </span>
                        <p className='text-[15px] ml-3 text-blue-950'> Sổ địa chỉ</p>
                    </span>
                </nav>
                
            </div>
        </main>
    )
}

export default DetailAuth