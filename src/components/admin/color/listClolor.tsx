import { useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Input, Select, Table, Image, message } from "antd";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import type { ColumnsType } from "antd/es/table";
import { Palette } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const { Option } = Select;

// Dữ liệu mẫu fix cứng
const colorData = [
  { _id: '1', name: 'Red'},
  { _id: '2', name: 'Blue'},
  { _id: '3', name: 'Green'},
  { _id: '4', name: 'Yellow'},
  { _id: '5', name: 'Purple'},
];

const ListColor = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [colors, setColors] = useState(colorData);

  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setColors(prev => prev.filter(item => item._id !== id));
    message.success('Successfully removed the color');
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: '_id',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      align: 'center',
      width: 180, // cho đều hơn
      render: (_: any, record: any) => (
        <div className="flex justify-center gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/editcolor/${record._id}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              icon={<DeleteOutlined />}
              className="hover:!border-red-500 hover:!text-red-500"
            >
              Delete
            </Button>
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
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pl-6 pr-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow mt-10">
              <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                <Palette className="pr-2" style={{width: 35}} /> Color List
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <span className="text-gray-500">Showing</span>
                  <Select
                    value={itemsPerPage}
                    onChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1);
                    }}
                    style={{ width: 80 }}
                  >
                    {[3, 5, 10].map(num => (
                      <Option key={num} value={num}>{num}</Option>
                    ))}
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-64"
                  />
                  <Button
                    type="primary"
                    icon={<FiPlus />}
                    onClick={() => navigate("/admin/addcolor")}
                  >
                    Add New
                  </Button>
                </div>
              </div>
              <Table
                dataSource={filteredColors}
                columns={columns}
                rowKey="_id"
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredColors.length,
                  onChange: setCurrentPage,
                  showSizeChanger: false
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

export default ListColor;
