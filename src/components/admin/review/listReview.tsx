import { useState, useEffect } from "react";
import { DeleteOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Switch, message, Input, Select, Table, Rate } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useDelete } from "../../../hooks/useDelete";
import { useListReview } from "../../../hooks/useListReview";
import { useToggleReviewStatus } from "../../../hooks/useToggleReviewStatus";
import { useApproveReview } from "../../../hooks/useUpdateAction";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

const ListReview = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: reviews,
    refetch: refetchReview,
  } = useListReview({ resource: "/reviews/admin/reviews" });

  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const toggleReviewStatus = useToggleReviewStatus();
  const approveReview = useApproveReview();
  const [hasShownSuccess, setHasShownSuccess] = useState(false);

  useEffect(() => {
    if (Array.isArray(reviews)) {
      setLocalReviews(reviews);
    }
  }, [reviews]);

  useEffect(() => {
    const updated = location.state?.updatedReview;
    if (updated) {
      setLocalReviews(prev =>
        prev.map(r => r._id === updated._id ? { ...r, ...updated } : r)
      );
      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.updatedReview, navigate]);

  useEffect(() => {
    const successMessage = location.state?.successMessage;
    if (successMessage && !hasShownSuccess) {
      message.success(successMessage);
      setHasShownSuccess(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, hasShownSuccess]);

  const filteredReviews = localReviews.filter((review: any) =>
    (review?.user_id?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (review?.comment ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    toggleReviewStatus.mutate(
      { reviewId: id },
      {
        onSuccess: () => {
          message.success("Cập nhật hiển thị đánh giá thành công");
          refetchReview();
        },
        onError: () => message.error("Cập nhật thất bại"),
      }
    );
  };


  const handleSelectApproval = (reviewId: string, value: boolean) => {
    if (value === true) {
      approveReview.mutate(reviewId, {
        onSuccess: () => {
          message.success("Đã duyệt đánh giá");
          refetchReview();
        },
        onError: () => message.error("Lỗi khi duyệt đánh giá"),
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "Phê duyệt",
      render: (_: any, record: any) => (
        <Select
          value={record.approved === true}
          onChange={(value) => handleSelectApproval(record._id, value)}
          style={{ width: 120 }}
          disabled={record.approved === true}
          options={[
            { label: "Chờ duyệt", value: false },
            { label: "Đã duyệt", value: true },
          ]}
        />
      ),
    },
    {
      title: "Ẩn / Hiện",
      dataIndex: "hidden",
      align: "center",
      render: (hidden: boolean, record: any) => (
        <Switch checked={!hidden} onChange={() => handleToggleStatus(record._id)} />
      ),
    },
    {
      title: "User",
      dataIndex: "user_id",
      render: (user: any) => user?.name || "Unknown",
    },
    {
      title: "Product ID",
      dataIndex: "product_id",
      render: (product: any) => product?._id || "N/A",
    },
    {
      title: "Product Name",
      dataIndex: "product_id",
      render: (product: any) => product?.name || "Unknown",
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (images: any[]) =>
        Array.isArray(images) && images.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {images.map((img, index) => {
              const src = typeof img === "string" ? img : img?.url;
              return (
                <img
                  key={index}
                  src={src}
                  alt={`review-img-${index}`}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                />
              );
            })}
          </div>
        ) : (
          <span className="text-gray-400">Không có ảnh</span>
        ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating: number) => <Rate disabled value={rating} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "Reply",
      dataIndex: "reply",
      render: (reply: string) => reply || "Chưa phản hồi",
    },
    {
      title: "Action",
      align: "right",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-end">
          <Button
            type="default"
            className="border-blue-500 text-blue-500 hover:!bg-blue-50"
            onClick={() => navigate(`/admin/editreview/${record._id}`)}
            icon={<MessageOutlined />}
          >
            Reply Review
          </Button>
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
                <MessageSquare className="pr-2" style={{ width: 30 }} /> Review List
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
                    {[3, 5, 10].map((num) => (
                      <Option key={num} value={num}>
                        {num}
                      </Option>
                    ))}
                  </Select>
                </div>
                <Input
                  placeholder="Search by user or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  className="w-64"
                />
              </div>
              <Table
                dataSource={filteredReviews}
                columns={columns}
                rowKey="_id"
                pagination={{
                  current: currentPage,
                  pageSize: itemsPerPage,
                  total: filteredReviews.length,
                  onChange: setCurrentPage,
                  showSizeChanger: false,
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

export default ListReview;
