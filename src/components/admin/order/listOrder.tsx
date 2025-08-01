import { useEffect, useMemo, useState } from "react";
import { Table, Select, Button, Input, message, Card, Typography, Tag, Popconfirm } from "antd";
import { useList } from "../../../hooks/useList";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { ExclamationCircleOutlined, EyeOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from 'framer-motion';
import ExportOrderList from "./exportOrderList";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const ListOrder = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const modalParam = searchParams.get("modal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const nav = useNavigate();

  const { data, refetch } = useList({ resource: "/orders" });
  
  const fetchAllOrders = async () => {
    setIsLoadingAll(true);
    let ordersData: any[] = [];
    let page =  1;
    let totalPages = 1;
    const limit = 20;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/orders?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { orders, total } = res.data.data;
      ordersData = [...orders];
      totalPages = Math.ceil(total / limit);
      
      if (totalPages > 1) {
        for (let i = 2; i <= totalPages; i++ ) {
          const res = await axios.get(`http://localhost:3000/api/orders?page=${i}&limit=${limit}`, {
            headers : {
              Authorization: `Bearer ${token}`
            }
          });
          ordersData = [...ordersData, ...res.data.data.orders];
        }
      }
      setAllOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch all orders:", error);
      return [];
    }
    finally {
      setIsLoadingAll(false);
    }
  }
  
  
  useEffect(() => {
    fetchAllOrders();
  }, [data]);

  const statusOptions = [
    "pending", "confirmed", "processing", "shipping",
    "delivered", "completed", "cancelled", "returning" , "returned",
  ];

  const statusColors: Record<string, string> = {
    pending: "#faad14",
    confirmed: "#1677ff",
    processing: "#13c2c2",
    shipping: "#722ed1",
    delivered: "#2f54eb",
    completed: "#52c41a",
    cancelled: "#ff4d4f",
    returning: "#ffc53d",
    returned: "#d46b08",
  };

  const getSelectableStatuses = (currentStatus: string) => {
    const currentIndex = statusOptions.indexOf(currentStatus);

    return statusOptions.map((status, index) => {
      let isDisabled = false;

      // Không cho phép chọn 'cancelled' từ FE
      if (status === "cancelled") {
        isDisabled = true;
      }

      // Chỉ cho phép chọn 'returned' nếu đang ở trạng thái 'returning'
      if (status === "returned" && currentStatus !== "returning") {
        isDisabled = true;
      }

      // Không cho quay lại trạng thái trước (ngoại trừ trạng thái hiện tại)
      if (index <= currentIndex && status !== currentStatus && status !== "returned") {
        isDisabled = true;
      }

      return {
        value: status,
        disabled: isDisabled,
      };
    });
  };


  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setLoadingOrderId(orderId);
      const token = localStorage.getItem("token");
      await axiosInstance.patch(
        `/orders/${orderId}/status`,
        { 
          status: newStatus,
          note: `Status updated successfully ${newStatus}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Status updated successfully!");
      await fetchAllOrders();
    } catch {
      message.error("Failed to update status.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const filteredData = useMemo(() => {
    const orders = allOrders;

    return [...orders]
      .filter((item) => {
        const matchesSearch =
          item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          activeStatusTab === "all" || item.status === activeStatusTab;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [allOrders, searchTerm, sortOrder, activeStatusTab]);

  const handleComfirm = (orderID:string) => {
    try {
      nav(`/admin/orderDetail/${orderID}`)
    } catch (error:any) {
      message.error(error || "Đã xảy ra lỗi")
    }
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      },
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      
    },
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Shipping Address",
      dataIndex: ["address", "address"],
      key: "address",
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Select
          value={status}
          onChange={(value) => handleUpdateStatus(record._id, value)}
          style={{ width: 140, fontWeight: 600 }}
          loading={loadingOrderId === record._id}
        >
          {getSelectableStatuses(status).map((option:any) => (
            <Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              title={
                option.value === "cancelled"
                  ? "Admin không được phép huỷ đơn hàng"
                  : ""
              }
            >
              <span
                style={{
                  color: statusColors[option.value],
                  fontWeight: 500,
                  opacity: option.disabled && option.value !== status ? 0.5 : 1,
                }}
              >
                {option.value.charAt(0).toUpperCase() + option.value.slice(1)}
              </span>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const isDelivered = record.status === "delivered";
        const hasReturnRequest = record.is_return_requested;

        // Tìm lý do trả hàng từ timeline cuối cùng
        const lastTimeline = record.timeline?.[record.timeline.length - 1];
        const returnReason = lastTimeline?.note;

        return (
          <div className="flex flex-col gap-2">
            {/* Nút xem chi tiết */}
            <Link to={`/admin/orderDetail/${record._id}`}>
              <Button icon={<EyeOutlined />}>Details</Button>
            </Link>

            {/* Nút xử lý yêu cầu trả hàng */}
            {isDelivered && hasReturnRequest && returnReason && (
              <div className="flex items-center gap-2 mt-1 bg-yellow-50 border border-yellow-300 rounded-lg px-2 py-1.5">
                <Popconfirm
                  title={
                    <>
                      <div><strong>Lý do trả hàng:</strong></div>
                      <div style={{ color: "red" }}>Vui lòng xem lý do trả hàng </div>
                    </>
                  }
                  okText="Ok"
                  cancelText="Cancel"
                  onConfirm={() => handleComfirm(record._id)}
                >
                  <Button icon={<ExclamationCircleOutlined />} style={{border: 0, color: "#eab308", background: 0}} className="text-yellow-500" size="small">
                    Review return request
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        );
      },
    }

  ];
  const Export = async () => {
    
  }
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
          <div className="p-6 min-h-screen bg-gray-100">
            <Card
              bordered={false}
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Title level={3}>Order List</Title>

              {/* Tabs Trạng Thái */}
              <div className="flex gap-8 mb-6 border-b pb-2 overflow-x-auto">
                {["all", ...statusOptions].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatusTab(status)}
                    className={`text-[15px] font-semibold pb-1 border-b-2 ${
                      activeStatusTab === status
                        ? "text-red-600 border-red-600"
                        : "text-gray-500 border-transparent hover:text-black"
                    } transition`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span>Sắp xếp:</span>
                  <Select
                    value={sortOrder}
                    onChange={setSortOrder}
                    style={{ width: 130 }}
                  >
                    <Option value="asc">Cũ nhất</Option>
                    <Option value="desc">Mới nhất</Option>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Tìm theo ID hoặc email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    style={{ width: 250 }}
                  />
                  <Button type="primary" onClick={() => setShowModal("exportPDF")}>Export to PDF file</Button>
                </div>
                
              </div>
              
              <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                bordered
                loading={isLoadingAll}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: filteredData.length,
                  onChange: (page, pageSize) => {
                    setPagination({ current: page, pageSize });
                  },
                }}
              />
            </Card>
            <ExportOrderList 
              isOpen={showModal === "exportPDF"}
              onClose={async () => {
                setShowModal("");
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListOrder;
