import React, { useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Image, Input, Popconfirm, Select, Table } from "antd";
import { Link } from "react-router-dom";
import { useDelete } from "../../../hooks/useDelete";
import { useList } from "../../../hooks/useList";
import { motion, AnimatePresence } from 'framer-motion';
import { ChartColumnStacked } from "lucide-react";
import { render } from "react-dom";

const { Search } = Input;
const { Option } = Select;

const ListCategory = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, refetch } = useList({
    resource: "/categories/admin",
  });

  const { mutate: deleteCategory } = useDelete({
    resource: "/categories/admin",
    onSuccess: refetch,
  });

  const sortedData = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return [...data.data]
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [data?.data, searchTerm, sortOrder]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      ellipsis: true,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: any) =>
        image?.url ? (
          <Image
            src={image.url}
            alt={image.alt || "Category image"}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex space-x-2">
          <Link to={`/admin/editCategory/${record._id}`}>
            <Button
              icon={<EditOutlined />}
              type="primary"
            />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => deleteCategory(record._id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined />}
              danger
              className="hover:!border-red-500 hover:!text-red-500"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

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
          <div className="w-full px-6 bg-gray-50 min-h-screen">
            <div className="w-full h-auto px-6 py-5 bg-white mt-10 rounded-lg border border-gray-200">
              <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                <ChartColumnStacked style={{width: 35}} className="pr-2" /> Danh sách danh mục sản phẩm
              </h2>
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Show</span>
                  <Select
                    value={itemsPerPage}
                    onChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1);
                    }}
                    style={{ width: 80 }}
                  >
                    {[3, 5, 10].map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    value={sortOrder}
                    onChange={(value) => {
                      setSortOrder(value);
                      setCurrentPage(1);
                    }}
                    style={{ width: 120 }}
                  >
                    <Option value="asc">Cũ nhất</Option>
                    <Option value="desc">Mới nhất</Option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-64"
                  />
                  <Link to="/admin/addcategory">
                    <Button type="primary" icon={<PlusOutlined />}>
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>

              <Table
                rowKey="_id"
                columns={columns}
                dataSource={sortedData}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: sortedData.length,
                  onChange: (page) => setCurrentPage(page),
                }}
                bordered
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListCategory;