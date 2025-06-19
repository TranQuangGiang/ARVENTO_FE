import { Button, Image, Popconfirm, Select, Table, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useList } from '../../../hooks/useList';
import { DeleteOutlined, EyeOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useDelete } from '../../../hooks/useDelete';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';

const ListBlog = () => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const { data, isLoading, refetch } = useList(
        { resource: "/posts/admin" }
    );

    const sortedData = useMemo(() => {
        if (!Array.isArray(data?.data.docs)) return [];
        return [...data.data.docs].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [data?.data?.docs, sortOrder]);

    const { Option } = Select;
    const deleteBlog = (_id: any) => {
        deleteBlogMutate(_id);
        
    };
    const { mutate: deleteBlogMutate } = useDelete({
        resource: "/posts/admin",
        onSuccess: refetch
    });
    const columns: ColumnsType<any> = [
        {
            title: <span className="font-semibold">Title</span>,
            dataIndex: "title",
            key: "title",
            align: "center",
            width: 200,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-2 text-[13px]">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: <span className="font-semibold">Slug</span>,
            dataIndex: "slug",
            key: "slug",
            align: "center",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-2 text-[13px]">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: <span className="font-semibold">status</span>,
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120
        },
        {
            title: <span className="font-semibold">Thumbnail</span>,
            dataIndex: "thumbnail",
            key: "thumbnail",
            align: "center",
            render: (imageSrc: string) => {
                return <Image src={imageSrc} width={100}></Image>
            },
            width: 120
        },
        {
            title: <span className="font-semibold">Excerpt</span>,
            dataIndex: "excerpt",
            key: "excerpt",
            align: "center",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="line-clamp-2 text-[13px]">{text}</span>
                </Tooltip>
            ),
        },
        
        {
            title: <span className="font-semibold">Ngày tạo</span>,
            dataIndex: "created_at",
            key: "created_at",
            align: "center",
            render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
            width: 120
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_:any, blog: any) => {
                return <div className='flex items-center'>
                <Link to={`/admin/detailBlog/${blog._id}`}>
                    <Button type="default" style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }} className="mr-[10px]"><EyeOutlined /></Button>
                </Link>
                <Popconfirm title="Bạn chắc chắc chứ ?" onConfirm={() => deleteBlog(blog._id)} okText="Ok" cancelText="Cancel">
                    <Button danger ><DeleteOutlined /></Button>
                </Popconfirm>
                <Link to={`/admin/editBlog/${blog._id}`}>
                    <Button className='ml-[10px]' type='primary'><FormOutlined /></Button>
                </Link>
                </div>
            },
            width: 120 
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
                    initial={{y: 50, opacity: 0}}
                    animate={{y:0, opacity: 1}}
                    exit={{y: 50, opacity: 0}}
                    transition={{duration: 0.5, ease: "easeOut"}}
                >
                    <div className="ml-6 mr-6 mt-10 mb-10 p-8 rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-tr from-white to-gray-50">
                        <span className='w-full flex items-center justify-between mb-3'>
                            <h2 className="text-[22px] font-bold text-gray-800">📝 Post List</h2>
                            <Link to={`/admin/addBlog`}>
                                <Button
                                style={{width: 130, height: 40}}
                                type="primary"
                                icon={<PlusOutlined />}
                                className="h-10 w-[170px] text-[18px] font-medium bg-blue-600 hover:bg-blue-700 transition-all"
                                >
                                Create
                                </Button>
                            </Link>
                        </span>
                        <Select
                            defaultValue="desc"
                            value={sortOrder}
                            onChange={(value) => setSortOrder(value as "asc" | "desc")}
                            style={{ width: 180 }}
                            placeholder="Lọc theo ngày tạo"
                        >
                            <Option value="desc">🕒 Mới nhất</Option>
                            <Option value="asc">📅 Cũ nhất</Option>
                        </Select>
                        <Table
                            dataSource={sortedData}
                            columns={columns}
                            loading={isLoading}
                            pagination={{ pageSize: 5 }}
                            rowKey="_id"
                            bordered
                            className="rounded-xl overflow-hidden mt-4 text-[13px] text-justify"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ListBlog
