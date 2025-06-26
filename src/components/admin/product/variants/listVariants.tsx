import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Image, Popconfirm, Table } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useList } from '../../../../hooks/useList';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { useDelete } from '../../../../hooks/useDelete';

const ListVariants = () => {
    const { id } = useParams();
    
    const { data, refetch: refetchVarinats } = useList({
        resource: `/variants/products/${id}/variants`,
    })

    const { mutate: deleteVariantMutate } = useDelete({
        resource: `/variants/products/${id}/variants`,
        onSuccess: () => {
            refetchVarinats();
        },
    })
    
    const deleteVariant = (_id: any) => {
        deleteVariantMutate(_id)
    }

    const columns: ColumnsType<any> = [
        {
            title: "ID",
            dataIndex: "_id",
            key: "_id",
            align: "center",
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            align: "center",
            render: (image: any) => {
                return <Image src={image?.url} width={100}></Image>
            }
        },
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
            render: (color: {name: string}) => (
                <div>
                    <span>{color.name}</span>
                </div>
            ),
            align: "center",
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
            align: "center",
        },
        {
            title: "Stock",
            dataIndex: "stock",
            key: "stock",
            align: "center",
        },
        {
            title: "CreateAt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
            align: "center",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_:any, record: any) => (
                <>
                    <Button
                        icon={<EyeOutlined />}
                        className="mr-1"
                        onClick={() => console.log("View:", record)}
                        type="default" style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
                    />
                    
                    <Link to={`/admin/editVariants/${record.product_id}/${record._id}`}>
                        <Button icon={<EditOutlined />} className="mr-1" type="primary" />
                    </Link>

                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        okText="Delete"
                        cancelText="Cancel"
                        onConfirm={() => deleteVariant(record._id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ]
    return (
        <div>
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
                        <div className="pl-6 pr-6 mt-0 bg-gray-50 min-h-screen">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 mt-10">
                              
                                    <h2 className="text-[22px] font-bold text-gray-800 mb-5">
                                        <AppstoreAddOutlined className="pr-2" /> Variants List
                                    </h2>
                                    
                                
                                <Table
                                    rowKey="_id"
                                    columns={columns}
                                    dataSource={data?.data?.data || []}
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default ListVariants