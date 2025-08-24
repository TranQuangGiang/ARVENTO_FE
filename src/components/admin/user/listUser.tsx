import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button, Pagination, Popconfirm, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EnvironmentOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import AddAddressesAdmin from './addAddressAdmin';

const ListUser = () => {
    const [showModal, setShowModal] = useState<string | null>(null);
    const [userId, setUserId ] = useState<string | null>(null);

    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;    

    useEffect(() => {
        const fetchAllUsers = async () => {
            let fetchedUsers:any = [];
            let page = 1;
            let hasNextPage = true;
            const limitPerPage = 50;

            while(hasNextPage) {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axiosInstance.get(`/users?page=${page}&limit=${limitPerPage}`, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    const { data } = res?.data;

                    if (data && data.docs) {
                        fetchedUsers = [...fetchedUsers, ...data.docs];
                    }

                    if (data && data.hasNextPage) {
                        page = data.nextPage;
                    } else {
                        hasNextPage = false;
                    }
                } catch (error) {
                    console.error("Lỗi khi tải user:", error);
                    hasNextPage = false;
                }
            }

            setAllUsers(fetchedUsers);
        }

        fetchAllUsers();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth"});
    }

    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
            key: "_id"
        },
        {
            title: "Họ tên",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Địa chỉ email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                return role === "admin" ? (
                    <Tag color='gold'> Quản trị viên</Tag>
                ) : (
                    <Tag color='blue'> Người dùng</Tag>
                )
            }
        },
        {   
            title: "Xác thực email",
            dataIndex: "verified",
            key: "verified",
            render: (verified: boolean) => {
                return verified ? (
                    <Tag color="green">Đã xác thực</Tag>
                ) : (
                    <Tag color="red">Chưa xác thực</Tag>
                );
            }
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            key: "created_at",
            render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: "Hành động",
            key: "ation",
            render: (_:any, record: any) => (
                <>
                    <Link to={`/admin/getUserOne/${record._id}`}>
                        <Button
                            icon={<EyeOutlined />}
                            className="mr-1"
                            onClick={() => console.log("View:", record)}
                            type="default" style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
                        />
                    </Link>
                    <Link to={`/admin/editUser/${record._id}`}>
                        <Button icon={<EditOutlined />} className="mr-1" type="primary" />
                    </Link>
                    <Button 
                        className="mr-1" 
                        onClick={() => {
                            setShowModal("addAddressAdmin")
                            setUserId(record?._id)
                        }} 
                        icon={<EnvironmentOutlined />} 
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa người dùng này ?"
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ] 
    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
            >
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className='pl-6 pr-6 mt-0 bg-gray-50 min-h-screen'>
                        <div className='bg-white p-6 rounded-2xl border border-gray-200 mt-10'>
                            <span className='w-full flex justify-between'>
                                <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                                    <Users style={{width: 35}}  className="pr-2" /> Danh sách người dùng
                                </h2>
                                <Link to={`/admin/createUser`}>
                                    <Button type='primary' icon={<PlusOutlined />} style={{width: 190, height: 40}}>Thêm mới người dùng</Button>
                                </Link>
                            </span>
                            
                            <Table dataSource={allUsers} columns={columns} />
                        </div>
                    </div>
                    <div>
                        {allUsers.length > pageSize && (
                            <div className='text-center'>
                                <Pagination 
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={allUsers.length}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                    <AddAddressesAdmin 
                        isOpen={showModal === "addAddressAdmin"} 
                        onClose={() => setShowModal(null)} 
                        userId={userId}    
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>      
        
    )
}

export default ListUser