import React, { useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Select, Switch, Table } from "antd";
import { Link } from "react-router-dom";
import { useList } from "../../../hooks/useList";
import { useDelete } from "../../../hooks/useDelete";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../utils/axiosInstance";
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket } from "lucide-react";


const { Option } = Select;

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  description?: string;
  isActive: boolean;
}

const ListCoupon: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");

  const { data, refetch } = useList({
    resource: "/coupons/admin/coupons",
  });

  const { mutate: deleteCoupon } = useDelete({
    resource: "/coupons/admin/coupons",
    onSuccess: refetch,
  });

 const { mutate: toggleCouponStatus, isPending: isToggling } = useMutation({
  mutationFn: async (id: string) => {
  const token = localStorage.getItem("token"); 
  const res = await axiosInstance.put(
    `/coupons/admin/${id}/toggle`,
    {}, 
    {
      headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
    }
  );
  return res.data;
},

  onSuccess: () => {
    message.success("Cập nhật trạng thái thành công");
    refetch();
  },
  onError: (error: any) => {
    message.error("Cập nhật thất bại: " + error.message);
  }
});


  const coupons = data?.data?.coupons || [];

  const filteredData = useMemo(() => {
    return coupons.filter((item: Coupon) => {
      const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive =
        isActiveFilter === "all" || String(item.isActive) === isActiveFilter;
      return matchesSearch && matchesActive;
    });
  }, [coupons, searchTerm, isActiveFilter]);

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại giảm giá",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Giá trị chiết khấu",
      dataIndex: "discountValue",
      key: "discountValue",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: Coupon) => (
        <Switch
          checked={isActive}
          loading={isToggling}
          onChange={() => toggleCouponStatus(record._id)}
        />
      ),
    },

    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Coupon) => (
        <div className="flex space-x-2">
          <Link to={`/admin/editCoupon/${record._id}`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
            /> 
          </Link>
         
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => deleteCoupon(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
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
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 50}}
          transition={{duration: 0.5, ease: "easeOut"}}
        >
          <div className="w-full px-6 bg-gray-50 min-h-screen">
            <div className="w-full h-auto px-6 py-5 bg-white mt-10 rounded-lg border border-gray-200">
              <h2 className="text-[22px] flex items-center font-bold text-gray-800 mb-5">
                <Ticket style={{width: 35}} className="pr-2" /> Danh sách mã giảm giá
              </h2>
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Trạng thái</span>
                  <Select
                    value={isActiveFilter}
                    onChange={(value) => setIsActiveFilter(value)}
                    style={{ width: 150 }}
                  >
                    <Option value="all">Tất cả</Option>
                    <Option value="true">Đang hoạt động</Option>
                    <Option value="false">Không hoạt động</Option>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tìm kiếm theo mã..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="w-64"
                  />
                  <Link to="/admin/addCoupon">
                    <Button type="primary" icon={<PlusOutlined />}>
                      Thêm mới
                    </Button>
                  </Link>
                </div>
              </div>

              <Table
                rowKey="_id"
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                bordered
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListCoupon;
