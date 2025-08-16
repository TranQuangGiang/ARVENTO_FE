import React, { useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Table } from "antd";
import { Link } from "react-router-dom";
import { useDelete } from "../../../hooks/useDelete";
import { useList } from "../../../hooks/useList";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";

const { Option } = Select;

const ListColorAvarin = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data, refetch } = useList({
    resource: "/options",
  });

  const { mutate: deleteOption } = useDelete({
    resource: "/options",
    onSuccess: refetch,
  });

  const filteredData = useMemo(() => {
    if (!Array.isArray(data?.data?.data)) return [];
    return [...data.data.data]
      .filter((item) =>
        item.key.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [data?.data?.data, searchTerm, sortOrder]);

 const columns = [
  {
    title: "Thuộc tính",
    dataIndex: "key",
    key: "key",
    width: 150,
  },
  {
    title: "Giá trị",
    dataIndex: "values",
    key: "values",
    render: (values: any[]) => (
      <div className="flex flex-wrap gap-2">
        {values?.map((v, idx) =>
          typeof v === "string" ? (
            <span key={idx} className="border px-2 py-1 rounded text-sm">
              {v}
            </span>
          ) : (
            <span key={idx} className="border px-2 py-1 rounded text-sm">
              {v.name} {v.hex && <span className="text-xs text-gray-500">({v.hex})</span>}
            </span>
          )
        )}
      </div>
    ),
  },
  {
    title: "Hành động",
    key: "actions",
    width: 150,
    render: (_: any, record: any) => (
      <div className="flex gap-2">
        <Link to={`/admin/editcolor/${record.key}`}>
          <Button type="primary" icon={<EditOutlined />} />
        </Link>
        <Popconfirm
          title="Bạn chắc chắc muốn xóa thuộc tính này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => deleteOption(record.key)}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
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
                <Palette style={{ width: 35 }} className="pr-2" /> Danh sách thuộc tính
              </h2>
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Hiện</span>
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
                    <Option value="asc">Mới nhất</Option>
                    <Option value="desc">Cũ nhất</Option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm kiếm theo từ khóa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-64"
                  />
                  <Link to="/admin/addcolor">
                    <Button type="primary" icon={<PlusOutlined />}>
                      Thêm mới
                    </Button>
                  </Link>
                </div>
              </div>

              <Table
                rowKey="key"
                columns={columns}
                dataSource={filteredData}
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredData.length,
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

export default ListColorAvarin;
