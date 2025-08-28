import { useState, useEffect } from "react";

import { MessageOutlined } from '@ant-design/icons';

import { Button, Switch, message, Input, Select, Table, Rate } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useListReview } from "../../../hooks/useListReview";
import { useToggleReviewStatus } from "../../../hooks/useToggleReviewStatus";
import { useApproveReview } from "../../../hooks/useUpdateAction";
import type { ColumnsType } from "antd/es/table";
import { useList } from "../../../hooks/useList";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";

const { Option } = Select;

const ListReview = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const toggleReviewStatus = useToggleReviewStatus();
  const approveReview = useApproveReview();
  const [hasShownSuccess, setHasShownSuccess] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productFilter, setProductFilter] = useState<string | undefined>(undefined);
  
  const fetchAllReviews = async () => {
    let fetchedReviews: any[] = [];
    let page = 1;
    let totalPages = 1;
    const limitPerPage = 50;
    const token = localStorage.getItem("token");

    try {
      do {
        
        const res = await axiosInstance.get(
          `/reviews/admin/reviews?page=${page}&limit=${limitPerPage}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const { data } = res?.data;

        if (data && data.reviews) {
          fetchedReviews = [...fetchedReviews, ...data.reviews];
        }

        totalPages = data.totalPages;
        page++;
      } while (page <= totalPages);

      setLocalReviews(fetchedReviews);
    } catch (error) {
      console.error("Lỗi khi tải toàn bộ review:", error);
    }
  };

  useEffect(() => {
    if (localReviews) {
      fetchAllReviews();
    }
    
  }, [localReviews]);
    

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

  const handleToggleStatus = (id: string) => {
    toggleReviewStatus.mutate(
      { reviewId: id },
      {
        onSuccess: () => {
          message.success("Cập nhật hiển thị đánh giá thành công");
          fetchAllReviews();
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
          fetchAllReviews();
        },
        onError: () => message.error("Lỗi khi duyệt đánh giá"),
      });
    }
  };


  // sản phẩm
  useEffect(() => {
    const fetchAllProducts = async () => {
      let fetchedProducts:any = [];
      let page = 1;
      let hasNextPage = true;
      const limitPerPage = 50;

      while (hasNextPage) {
        try {
          const res = await axios.get(`http://localhost:3000/api/products?page=${page}&limit=${limitPerPage}`);
          const { data } = res?.data;

          if (data && data.docs) {
            fetchedProducts = [...fetchedProducts, ...data.docs];
          }

          if (data && data.hasNextPage) {
            page = data.nextPage;
          } else {
            hasNextPage = false;
          }
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm:", error);
          hasNextPage = false;
        }
      }

      setAllProducts(fetchedProducts)
    }

    fetchAllProducts();
  }, []);

  const productOption = allProducts.map((product: any) => ({
    label: product.name,
    value: product._id
  }))

  const filteredReviews  = localReviews
    .filter((review: any) => 
      (review?.user_id?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    .filter((review: any) => {
      if (!productFilter) {
        return true;
      }
      return review?.product_id?._id === productFilter;
    })

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
      title: "Khách hàng",
      dataIndex: "user_id",
      render: (user: any) => user?.name || "Unknown",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_id",
      render: (product: any) => product?.name || "Unknown",
    },
    {
      title: "Ảnh",
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
      title: "Phản hồi",
      dataIndex: "reply",
      render: (reply: string) => reply || "Chưa phản hồi",
    },
    {
      title: "Hành động",
      align: "right",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-end">
          <Button
            type="primary"
            onClick={() => navigate(`/admin/reply/${record._id}`)}
            icon={<MessageOutlined />}
          >
            Phản hồi 
          </Button>
          <Button
            className="ml-1"
            onClick={() => navigate(`/admin/detailReview/${record._id}`)}
            type="default"
            style={{ backgroundColor: "#00CD00", color: "#fff", borderColor: "#52c41a" }}
          >
            Chi tiết 
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
                <MessageSquare className="pr-2" style={{ width: 30 }} /> Danh sách đánh giá sản phẩm
              </h2>
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 items-center">
                  <div>
                    <span className="text-gray-500 mr-1.5">Hiện</span>
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
                  <div className="ml-4">
                    <Select
                      placeholder="Lọc theo sản phẩm"
                      allowClear
                      value={productFilter}
                      onChange={(value) => {
                        setProductFilter(value);
                        setCurrentPage(1); // Quay về trang 1 khi lọc
                      }}
                      style={{ minWidth: 300 }}
                      options={productOption}
                    >
                      
                    </Select>
                  </div>
                </div>
                
                <Input
                  placeholder="Tìm kiếm theo người dùng hoặc bình luận..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                  style={{width: 500}}
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
