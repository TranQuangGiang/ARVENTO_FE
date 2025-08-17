import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button, Popconfirm, Table } from 'antd';
import { useList } from '../../../hooks/useList';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const ListUser = () => {
    const { data:users } = useList({
        resource: `/users`
    });
    console.log(users);
    
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
            key: "role"
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
                            
                            <Table dataSource={users?.data?.docs || []} columns={columns} />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>      
        
    )
}

export default ListUser