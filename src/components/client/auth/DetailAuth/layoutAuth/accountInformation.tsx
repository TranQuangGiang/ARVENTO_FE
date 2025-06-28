import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { useUserMe } from '../../../../../hooks/useOne'
import { useSearchParams } from 'react-router-dom'
import UpdateAccount from './updateAcconut'
import { Link } from 'react-router-dom'

const AccountInformation = () => {
    const [showModal, setShowModal] = useState<string | null>(null);
    const [searchParams] = useSearchParams(); 
    const { data:UserMe } = useUserMe({
        resource: `/users/me`
    })
    const modalParam = searchParams.get("modal");
        useEffect(() => {
            if (modalParam) {
                setShowModal(modalParam);
            }
        }, [modalParam]);
    return (
        <div className='w-full'>
            <div className='w-full h-[185px] rounded-[15px] bg-white'>
                <span className='flex justify-between items-center'>
                    <h4 className='pt-4 text-[17px] font-[Product Sans] font-bold ml-5'>Thông tin cá nhân</h4>
                    <Button
                        style={{ border: 0 }}
                        className={`mt-2.5`}
                        icon={<EditOutlined />}
                        onClick={() => setShowModal('updateAccount')}
                    >
                        Cập nhật thông tin
                    </Button>
                </span>
                <div className='w-full flex items-center mt-2.5'>
                    <div className='content-Auth w-1/2 flex flex-col items-center'>
                        <span className='w-[94%] ml-4 flex items-center justify-between h-16 border-b border-b-gray-300'>
                            <p className='text-gray-500 text-[14px] font-sans'>Họ và tên: </p>
                            <p className='text-[14px] uppercase font-sans font-semibold'>{UserMe?.data.name}</p>
                        </span>
                        <span className='w-[94%] ml-4 flex items-center justify-between h-16'>
                            <p className='text-gray-500 text-[14px] font-sans'>Email: </p>
                            <p className='text-[14px] font-sans font-semibold'>{UserMe?.data.email}</p>
                        </span>
                    </div>
                    <div className='content-Auth w-1/2 mr-4 flex flex-col items-center'>
                        <span className='w-[94%] ml-4 flex items-center justify-between h-16 border-b border-b-gray-300'>
                            <p className='text-gray-500 text-[14px] font-sans'>Số điện thoại: </p>
                            <p className='text-[14px] uppercase font-sans font-semibold'> NAN</p>
                        </span>
                        <span className='w-[94%] ml-4 flex items-center justify-between h-16'>
                            <p className='text-gray-500 text-[14px] font-sans'>Địa chỉ mặc định: </p>
                            <p className='text-[14px] uppercase font-sans font-semibold'></p>
                        </span>
                    </div>
                </div>
                <div className='w-full relative h-60 rounded-[15px] bg-white mt-5'>
                    <span className='w-[97%] absolute ml-1 flex items-center justify-between z-20'>
                        <h4 className='pt-4 text-[17px] font-[Product Sans] font-bold ml-5'>Sổ địa chỉ</h4>
                        <Link to={`/detailAuth/addAddresses`}>
                            <p className='text-[15px] text-blue-500 mt-3 cursor-pointer font-[Product Sans]'><PlusOutlined style={{width: 16}} className='mr-1' /> Thêm địa chỉ</p>
                        </Link>
                        
                    </span>
                    <div className="relative w-full h-full flex items-center flex-col justify-center pt-3">
                        <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                        {/* Nội dung ở phía trên */}
                        <span className="relative z-10 w-full flex flex-col items-center">
                            <img className="w-[170px]" src="/cartD.png" alt="" />
                        </span>
                        <p className='mt-2 text-[13px] font-medium font-sans text-blue-950'>Bạn chưa có địa chỉ nào được tạo!</p>
                    </div>
                </div>
            </div>
            <UpdateAccount isOpen={showModal === "updateAccount"} onClose={() => setShowModal(null)} />
        </div>
    )
}

export default AccountInformation