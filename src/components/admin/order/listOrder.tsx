import { useEffect, useMemo, useState } from "react";
import { Table, Select, Button, Input, message, Card, Typography, Tag, Popconfirm } from "antd";
import { useList } from "../../../hooks/useList";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { ArrowDownOutlined, ArrowUpOutlined, ExclamationCircleOutlined, EyeOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from 'framer-motion';
import ExportOrderList from "./exportOrderList";
import axios from "axios";
import ApproveReturnRequest from "./approveReturnRequest";
import RefundRequestDetail from "./RequestRefund";
import { createFromIconfontCN } from '@ant-design/icons';


const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87c4g.js', // Thay bằng URL của bạn
});

const { Option } = Select;
const { Title } = Typography;

const ListOrder = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const modalParam = searchParams.get("modal");
  const [sortOrder, setSortOrder] = useState<"created_at" | "-created_at" | "total" | "-total" | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [showReturnRequestModal, setShowReturnRequestModal] = useState(false);
  const [showRequestRefundModal, setShowRequestRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  console.log(selectedOrder);
  
  const { data, refetch } = useList({ resource: "/orders" });
  
  useEffect(() => {
    if (setShowModal === null) {
      refetch();
    }
    
  }, [setShowModal]);
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
      console.error("Không thể lấy được tất cả các đơn hàng:", error);
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
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipping", label: "Đang giao hàng" },
    { key: "delivered", label: "Đã giao hàng" },
    { key: "completed", label: "Hoàn thành" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "returning", label: "Đang trả hàng" },
    { key: "returned", label: "Đã trả hàng" },
  ];

  const statusLabels: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      returning: "Đang trả hàng",
      returned: "Đã trả hàng",
  };
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
    const statusLabels  = statusOptions.filter(opt => opt.key !== "all");
    const currentIndex = statusLabels.findIndex(option => option.key === currentStatus);

    return statusLabels.map((status, index) => {
      let isDisabled = false;

      // Không cho phép chọn 'cancelled' từ FE
      if (status.key === "cancelled") {
        isDisabled = true;
      }

      // Chỉ cho phép chọn 'returned' nếu đang ở trạng thái 'returning'
      if (status.key === "returned" && currentStatus !== "returning") {
        isDisabled = true;
      }

      // Không cho quay lại trạng thái trước (ngoại trừ trạng thái hiện tại)
      if (index <= currentIndex && status.key !== currentStatus && status.key !== "returned") {
        isDisabled = true;
      }

      return {
        value: status.key,
        label: status.label,
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
          note: `Cập nhập thành công trạng thái ${newStatus}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Cập nhập trạng thái thành công!");
      await fetchAllOrders();
    } catch {
      message.error("Cập nhập trạng thái thất bại");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const filteredData = useMemo(() => {
    const orders = allOrders;
    let sortedOrders = [...orders];
    if (sortOrder) {
      sortedOrders.sort((a:any, b:any) => {
        if (sortOrder === 'created_at' || sortOrder === '-created_at') {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return sortOrder === "created_at" ? dateA - dateB : dateB - dateA;
        }
        if (sortOrder === 'total' || sortOrder === '-total') {
          return sortOrder === "total" ? a.total - b.total : b.total - a.total;
        }
        return 0;
      });
    }
    return sortedOrders
      .filter((item) => {
        const matchesSearch =
          item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.user?.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          activeStatusTab === "all" || item.status === activeStatusTab;
        const matchesPaymentMethod = !paymentOrder || item.payment_method === paymentOrder;
        
        return matchesSearch && matchesStatus && matchesPaymentMethod;
      })
      
  }, [allOrders, searchTerm, sortOrder, activeStatusTab, paymentOrder]);

  const handleComfirm = (record: any) => {
    // Thay đổi tham số truyền vào từ orderID thành cả record để lấy lý do
    setSelectedOrder(record);
    setShowReturnRequestModal(true);
  };

  const RequestRefund = (record:any) => {
    setSelectedOrder(record)
    setShowRequestRefundModal(true)
  }
  // xác nhận đã nhận hàng hoàn
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "_id",
      
    },
    {
      title: "Khách hàng",
      dataIndex: ["user", "name"],
      key: "user",
    },
    
    {
      title: "Địa chỉ giao hàng",
      dataIndex: ["address", "address"],
      key: "address",
    },
    {
      title: "Trạng thái đơn hàng",
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
                {statusLabels[option.value]}
              </span>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => {
        const { status, is_return_requested, timeline } = record;
        const isDelivered = status === "delivered";
        const hasReturnRequest = is_return_requested;

        const returnRequestTimeline = timeline?.findLast((item:any) => item.note); 
        const returnReason = returnRequestTimeline?.note;

        const isReturning = status === "returning";

        return (
          <div className="flex flex-col gap-2">
            {/* Nút xem chi tiết */}
            <Link to={`/admin/orderDetail/${record._id}`}>
              <Button icon={<EyeOutlined />} style={{width: 160, height: 35}}>Chi tiết</Button>
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
                  onConfirm={() => handleComfirm(record)}
                >
                  <Button icon={<ExclamationCircleOutlined />} style={{border: 0, color: "#eab308", background: 0}} className="text-yellow-500" size="small">
                    Yêu cầu trả hàng
                  </Button>
                </Popconfirm>
              </div>
            )}
            {
              isReturning && (
                <div className="flex items-center gap-2 mt-1 bg-green-50 border border-green-300 rounded-lg px-2 py-1.5">
                  <Popconfirm
                    title="Chắc chắn muốn xác nhận"
                    okText="Xác nhận"
                    cancelText="Hủy"
                    onConfirm={() => RequestRefund(record)}
                  >
                    <Button 
                      icon={<ExclamationCircleOutlined />} 
                      style={{border: 0, color: "#52c41a", background: 0}} className="text-yellow-500" size="small"
                       
                    >
                      Đã nhận hàng hoàn
                    </Button>
                  </Popconfirm>
                </div>
              )
            }
          </div>
        );
      },
    }

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
          <div className="p-6 min-h-screen bg-gray-100">
            <Card
              bordered={false}
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Title level={3}>Danh sách đơn hàng</Title>

              {/* Tabs Trạng Thái */}
              <div className="flex gap-8 mb-6 border-b pb-2 overflow-x-auto">
                {statusOptions.map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setActiveStatusTab(status.key)}
                    className={`text-[15px] font-semibold pb-1 border-b-2 ${
                      activeStatusTab === status.key
                        ? "text-red-600 border-red-600"
                        : "text-gray-500 border-transparent hover:text-black"
                    } transition`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span>Sắp xếp:</span>
                    <Select
                      value={sortOrder}
                      allowClear
                      onChange={setSortOrder}
                      style={{ width: 160 }}
                      placeholder="Sắp xếp"
                    >
                      <Option value="-created_at"><FieldTimeOutlined /> Mới nhất</Option>
                      <Option value="created_at"><FieldTimeOutlined /> Cũ nhất</Option>
                      <Option value="-total"><ArrowUpOutlined /> Tổng tiền tăng dần</Option>
                      <Option value="total"><ArrowDownOutlined /> Tổng tiền giảm dần</Option>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-1.5">
                   
                    <Select
                      value={paymentOrder}
                      allowClear
                      onChange={setPaymentOrder}
                      style={{ width: 200 }}
                      placeholder="Lọc theo phương thức thanh toán"
                    >
                      <Option value="cod"> <span className="flex items-center"><img className="w-[25px] h-[25px] " src="https://cdn-icons-png.flaticon.com/512/1041/1041883.png" /> <p className="ml-2">Thanh toán khi nhận hàng</p></span></Option>
                      <Option value="zalopay"> <span className="flex items-center"><img className="w-[25px] h-[25px] " src="https://i.pinimg.com/1200x/a4/45/6c/a4456c70a348cced98601a00e4050ca1.jpg" /> <p className="ml-2">Zalo Pay</p></span></Option>
                      <Option value="momo"><span className="flex items-center"><img className="w-[25px] h-[25px] " src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" /> <p className="ml-2">Momo</p></span></Option>
                    </Select>
                  </div>
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
            <ApproveReturnRequest
              isOpen={showReturnRequestModal}
              onClose={() => {
                setShowReturnRequestModal(false);
                setSelectedOrder(null);
              }}
              selectedOrder={selectedOrder}
              onApproved={fetchAllOrders}
            />
            <RefundRequestDetail 
              isOpen={showRequestRefundModal}
              onClose={() => {
                setShowRequestRefundModal(false);
                setSelectedOrder(null)
              }}
              selectedOrder={selectedOrder}
              onApproved={fetchAllOrders}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListOrder;
