import { EditOutlined, PlusOutlined, CheckOutlined, DeleteColumnOutlined, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useUserMe } from '../../../../../hooks/useOne';
import { useSearchParams, Link } from 'react-router-dom';
import UpdateAccount from './updateAcconut';
import { useList } from '../../../../../hooks/useList';
import axios from 'axios';
import { useDelete } from '../../../../../hooks/useDelete';

const AccountInformation = () => {
    const [showModal, setShowModal] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    const modalParam = searchParams.get("modal");
    useEffect(() => {
        if (modalParam) {
            setShowModal(modalParam);
        }
    }, [modalParam]);

    const { data: UserMe } = useUserMe({ resource: `/users/me` });

    const { data: addressData, refetch } = useList({ resource: `/addresses/me` });
    const addresses: any[] = addressData?.data?.docs || [];
    const sortedAddresses = [...addresses].sort((a, b) => b.isDefault - a.isDefault);

    const { mutate: deleAddresses } = useDelete({
        resource: `/addresses`,
        onSuccess: refetch,
    })

    const delAddresses = async (id: any) => {
        deleAddresses(id);
    }

    return (
        <div className='w-full'>
            <div className='w-full rounded-[15px] bg-white p-6'>
                <div className='flex justify-between items-center'>
                    <h4 className='text-[17px] font-bold font-[Product Sans]'>Thông tin cá nhân</h4>
                    <Button
                        style={{ border: 0 }}
                        icon={<EditOutlined />}
                        onClick={() => setShowModal('updateAccount')}
                    >
                        Cập nhật thông tin
                    </Button>
                </div>

                <div className='grid grid-cols-2 mt-4 gap-4'>
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-between border-b pb-2'>
                            <p className='text-gray-500 text-[14px]'>Full name:</p>
                            <p className='text-[14px] font-sans font-medium'>{UserMe?.data.name}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-gray-500 text-[14px]'>Email:</p>
                            <p className='text-[14px] font-sans font-medium'>{UserMe?.data.email}</p>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <div className='flex justify-between border-b pb-2'>
                            <p className='text-gray-500 text-[14px]'>Phone:</p>
                            <p className='text-[14px] font-sans font-medium'>{sortedAddresses.find(addr => addr.isDefault)?.phone || "NAN"}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p className='text-gray-500 text-[14px]'>Default address:</p>
                            <p className='text-[14px] font-sans font-medium'>
                                {sortedAddresses.find(addr => addr.isDefault)?.fullAddress || "NAN"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-[100%] bg-white mt-8 rounded-[15px]">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[17px] font-bold font-[Product Sans]">Sổ địa chỉ</h4>
                        <Link to={`/detailAuth/addAddresses`}>
                            <p className="text-[15px] text-blue-500 cursor-pointer font-[Product Sans]">
                                <PlusOutlined className="mr-1" /> Thêm địa chỉ
                            </p>
                        </Link>
                    </div>

                    {sortedAddresses.length > 0 ? (
                        <div className="space-y-4">
                            {sortedAddresses.map((address) => (
                            <div
                                key={address._id}
                                className={`w-full border rounded-lg p-4 flex justify-between items-start shadow-sm ${
                                address.isDefault ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-slate-50'
                                }`}
                            >
                                <div>
                                    <p className="font-semibold text-[15px] text-gray-800">{address.label}</p>
                                    <p className="text-sm text-gray-700 mt-1">{address.fullAddress}</p>
                                    <p className="text-sm text-gray-700 mt-1">SĐT: {address.phone}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                {address.isDefault ? (
                                    <span className="text-blue-600 font-semibold text-sm flex items-center gap-1">
                                    <CheckOutlined /> Địa chỉ mặc định
                                    </span>
                                ) : (
                                    <Button
                                        size="small"
                                        type="default"
                                        className="text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600"
                                        onClick={async () => {
                                            try {
                                            const token = localStorage.getItem("token");
                                            await axios.patch(
                                                `http://localhost:3000/api/addresses/${address._id}/set-default`,
                                                {},
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                }
                                            );
                                            message.success("Đã đặt làm địa chỉ mặc định", 1);
                                            await refetch();
                                            } catch (error) {
                                            message.error("Có lỗi xảy ra khi đặt mặc định");
                                            }
                                        }}
                                    >
                                        Đặt làm mặc định
                                    </Button>
                                )}

                                <div className="flex gap-2 mt-3">
                                    <Link to={`/detailAuth/editAddresses/${address._id}`}>
                                        <Button size="small" type='primary' icon={<EditOutlined />} />
                                    </Link>
                                    <Popconfirm title="Bạn chắc chứ" okText="Ok" cancelText="Canel" onConfirm={() => delAddresses(address._id)}>
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>
                                </div>
                            </div>
                        </div>
                        ))}
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center pt-3 h-[200px] relative">
                            <div className="absolute w-[300px] h-[100px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                            <span className="relative z-10 w-full flex flex-col items-center">
                                <img className="w-[170px]" src="/cartD.png" alt="empty-address" />
                            </span>
                            <p className="mt-2 text-[13px] font-medium font-sans text-blue-950">
                                Bạn chưa có địa chỉ nào được tạo!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <UpdateAccount isOpen={showModal === "updateAccount"} onClose={() => setShowModal(null)} />
        </div>
    );
};

export default AccountInformation;
