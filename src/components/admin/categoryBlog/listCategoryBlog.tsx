import { Button, Popconfirm, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useList } from '../../../hooks/useList';
import { PlusOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { useDelete } from '../../../hooks/useDelete';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { ColumnsType } from 'antd/es/table';

const ListCategoryBlog = () => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { data, isLoading, refetch } = useList(
    { resource: "/categoryPost/admin" }
  );

  const sortedData = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [data?.data, sortOrder]);
  
  const { Option } = Select;
  const deleteCategoryBlog = (_id: any) => {
    deleteCategoryMutate(_id);
    
  };
  const { mutate: deleteCategoryMutate } = useDelete({
    resource: "/categoryPost/admin",
    onSuccess: refetch
  });
  const columns: ColumnsType<any> = [
    {
      title: <span className="font-semibold">ID</span>,
      dataIndex: "_id",
      key: "ID",
      align: "center",
    },
    {
      title: <span className="font-semibold">Name</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: <span className="font-semibold">Slug</span>,
      dataIndex: "slug",
      key: "slug",
      align: "center",
    },
    {
      title: <span className="font-semibold">Ngày tạo</span>,
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => dayjs(text).format('DD/MM/YYYY'),
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_:any, categoryBlog: any) => {
        return <>
          <Popconfirm title="Bạn chắc chắc chứ ?" onConfirm={() => deleteCategoryBlog(categoryBlog._id)} okText="Ok" cancelText="Cancel">
            <Button danger >Delete</Button>
          </Popconfirm>
          <Link to={`/admin/editCategoryBlog/${categoryBlog._id}`}>
            <Button className='ml-[15px]' type='primary'>Update</Button>
          </Link>
        </>
      } 
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
          animate={{y: 0, opacity: 1}}
          exit={{y: 50, opacity: 0}}
          transition={{duration: 0.5, ease: "easeOut"}}
        >
          <div className="ml-6 mr-6 mt-10 mb-10 p-8 rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-tr from-white to-gray-50">
            <span className='w-full flex items-center justify-between mb-3'>
              <h2 className="text-[22px] font-bold text-gray-800">📝 Danh sách danh mục bài viết</h2>
              <Link to={`/admin/addCategoryBlog`}>
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
              className="rounded-xl overflow-hidden mt-4"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ListCategoryBlog
