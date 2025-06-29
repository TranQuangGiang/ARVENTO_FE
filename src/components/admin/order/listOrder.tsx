import React, { useMemo, useState } from "react";
import { Select, Button, Input, Card, Image, message } from "antd";
import { useList } from "../../../hooks/useList";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import axiosInstance from "../../../utils/axiosInstance";

const { Option } = Select;

const ListOrder = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const { data, refetch } = useList({ resource: "/orders" });

  const statusOptions = ["pending", "confirmed", "shipping", "completed"];

  const statusColors: Record<string, string> = {
    pending: "#faad14",
    confirmed: "#1677ff",
    shipping: "#722ed1",
    completed: "#52c41a",
    canceled: "#ff4d4f",
  };

  // Lấy các trạng thái tiếp theo (vẫn hiển thị trạng thái hiện tại, nhưng disable)
  const getSelectableStatuses = (currentStatus: string) => {
    const currentIndex = statusOptions.indexOf(currentStatus);
    return statusOptions.map((status, index) => ({
      value: status,
      disabled: index <= currentIndex,
    }));
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoadingOrderId(orderId);
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Order status updated successfully!");
      refetch();
    } catch (error) {
      message.error("Failed to update order status.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const sortedData = useMemo(() => {
    const orders = data?.data?.orders;
    if (!Array.isArray(orders)) return [];
    return [...orders]
      .filter(
        (item) =>
          item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [data?.data?.orders, searchTerm, sortOrder]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 py-8 bg-gray-50 min-h-screen"
      >
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined style={{ fontSize: "20px", color: "black" }} />
              <h2 className="text-xl font-bold mb-0 text-black">Order List</h2>
            </div>
          }
          bordered
          className="bg-white shadow-lg"
        >
          <div className="mb-4 flex justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <Select value={sortOrder} onChange={(value) => setSortOrder(value)} style={{ width: 130 }}>
                <Option value="asc">Oldest first</Option>
                <Option value="desc">Newest first</Option>
              </Select>
            </div>
            <Input
              placeholder="Search by ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 250 }}
            />
          </div>

          <div className="flex flex-col gap-4">
            {sortedData.map((order) => (
              <Card key={order._id} bordered className="shadow-sm">
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-500 mb-1">Order ID: <strong>{order._id}</strong></p>
                    <p className="font-bold text-lg mb-2">Products in order:</p>
                    {order.items?.map((item) => {
                      const itemTotal = item.quantity * item.price;
                      return (
                        <div key={item.product._id} className="flex items-center gap-3 mb-2">
                          <Image
                            src={item.product.images[0]?.url}
                            width={70}
                            height={70}
                            preview={false}
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium text-base">
                              {item.product.name} - x{item.quantity} - 
                              <span className="text-red-600 font-semibold ml-1">
                                {itemTotal.toLocaleString()}₫
                              </span>
                            </p>
                            <p className="text-gray-600 text-sm">
                              Unit price: {item.price?.toLocaleString()}₫
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[220px]">
                    <Select
                      value={order.status}
                      onChange={(value) => handleUpdateStatus(order._id, value)}
                      style={{
                        width: 180,
                        fontWeight: 600,
                      }}
                      loading={loadingOrderId === order._id}
                      dropdownStyle={{ padding: 0 }}
                    >
                     {getSelectableStatuses(order.status).map((option) => (
  <Option key={option.value} value={option.value} disabled={option.disabled}>
    <span
      style={{
        color: statusColors[option.value], // ✅ luôn dùng màu trạng thái
        fontWeight: option.disabled ? 500 : 500,
        opacity: option.disabled && option.value !== order.status ? 0.5 : 1, // ✅ nếu là trạng thái hiện tại thì giữ opacity = 1
      }}
    >
      {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
    </span>
  </Option>
))}

                    </Select>

                    <p className="text-gray-600 text-base">
                      <CalendarOutlined /> Order date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-bold text-red-600 text-lg">
                      <DollarOutlined /> Total: {order.total?.toLocaleString()}₫
                    </p>
                    <Link to={`/admin/orderDetail/${order._id}`}>
                      <Button type="primary" size="large">View order details</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListOrder;
