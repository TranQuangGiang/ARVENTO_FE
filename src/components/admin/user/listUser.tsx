import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { Table } from 'antd';
import { useOneData } from '../../../hooks/useOne';

const ListUser = () => {
    const { data:users } = useOneData({
        resource: `/auth/listUser`
    });
    console.log(users);
    
    const columns = [
        {
            title: "Id",
            dataIndex: "_id",
            key: "_id"
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "Create At",
            dataIndex: "created_at",
            key: "created_at"
        },
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
                            <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                                <Users style={{width: 35}}  className="pr-2" /> Products List
                            </h2>
                            <Table dataSource={users} columns={columns} />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>      
        
    )
}

export default ListUser