import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Rate, Input, Upload, Button, message, Spin } from "antd";
import { SendOutlined, CloseOutlined, CameraOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const { TextArea } = Input;

const Review = ({
  orderId,
}:any) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [submittedReviews, setSubmittedReviews] = useState<any>({});

  const orderID = orderId
  console.log(orderID);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.data?.order || res.data.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        message.error("Không thể tải đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderID]);

  const productQuantityMap =
    order?.items?.reduce((acc: any, item: any) => {
      const productId = item.product._id;
      if (!acc[productId]) {
        acc[productId] = { ...item, quantity: 0 };
      }
      acc[productId].quantity += item.quantity;
      return acc;
    }, {}) || {};

  const uniqueProducts = Object.values(productQuantityMap);

  useEffect(() => {
    const fetchSubmittedReviews = async () => {
      if (!userId || !uniqueProducts.length) return;
      const token = localStorage.getItem("token");

      try {
        const responses = await Promise.all(
          uniqueProducts.map((item: any) =>
            axios.get(`http://localhost:3000/api/reviews/product/${item.product._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const submitted: any = {};
        uniqueProducts.forEach((item: any, index: number) => {
          const productId = item.product._id;
          const productReviews = responses[index]?.data?.data?.reviews || [];

          const userHasReviewed = productReviews.some((review: any) => {
            const reviewUser = review.user_id?._id || review.user_id?.id || review.user_id || review.user?._id;
            return reviewUser === userId && review.order_id === orderId;
          });

          submitted[productId] = userHasReviewed;
        });

        setSubmittedReviews(submitted);
      } catch (err) {
        console.error("Error checking submitted reviews", err);
      }
    };

    fetchSubmittedReviews();
  }, [userId, order]);

  const handleReviewChange = (productId: string, field: string, value: any) => {
    setReviews((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const resetReview = (productId: string) => {
    setReviews((prev: any) => ({
      ...prev,
      [productId]: {
        rating: 5,
        comment: "",
        images: [],
      },
    }));
  };

  const handleSubmitReview = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Vui lòng đăng nhập để đánh giá.");
      return;
    }

    let userInfo: any = null;
    try {
      userInfo = jwtDecode(token);
    } catch {
      message.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    if (!userInfo?.id) {
      message.warning("Vui lòng đăng nhập để đánh giá.");
      return;
    }

    const review = reviews[productId];
    if (!review || !review.rating || !review.comment?.trim()) {
      message.warning("Vui lòng nhập đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", review.rating);
    formData.append("comment", review.comment);
    formData.append("product_id", productId);
    formData.append("order_id", orderID);
    
    review.images?.forEach((file: any) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    try {
      await axios.post("http://localhost:3000/api/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Đánh giá của bạn đã được gửi!");
      resetReview(productId);
      setSubmittedReviews((prev: any) => ({
        ...prev,
        [productId]: true,
      }));
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Lỗi khi gửi đánh giá.");
    }
  };

  if (loading) {
    return <Spin className="mt-10" />;
  }

  if (!order || uniqueProducts.length === 0) {
    return <div className="p-6 text-gray-500">Không có dữ liệu đơn hàng hoặc sản phẩm.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 mt-7">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Đánh giá sản phẩm
        </h1>
        <div className="border border-gray-200 rounded-[10px] p-6 bg-white shadow-sm mt-6">
          {uniqueProducts.map((item: any, index: number) => {
            const productId = item.product?._id;
            const review = reviews[productId] || {};
            const isSubmitted = submittedReviews[productId];

            return (
              <div key={productId} className="mb-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.selected_variant?.image?.url || item.product?.images?.[0]?.url}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty:{item.quantity} -{" "}
                        <span>Màu sắc: {item.selected_variant.color.name}</span>
                      </p>
                      <span className="text-red-500 font-semibold text-lg mt-1 block">
                        {(item.unit_price * item.quantity).toLocaleString()}₫
                      </span>
                    </div>
                  </div>
                  
                </div>

                {index > 0 && <hr className="border-gray-300 w-full mb-6" />}

                {isSubmitted ? (
                  <p className="text-green-600 font-medium mt-4 text-center">
                    Bạn đã đánh giá sản phẩm này!
                  </p>
                ) : (
                  <div className="flex flex-col gap-4 items-start w-full mt-7 px-2">
                    <div className="w-full">
                      <h3 className="font-semibold text-gray-700 mb-2">Đánh giá của bạn</h3>
                      <div className="w-full mt-3">
                        <div className="flex w-full">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="flex-1 flex justify-center">
                              <Rate
                                value={review.rating >= star ? 1 : 0}
                                onChange={() => handleReviewChange(productId, "rating", star)}
                                count={1}
                                className="text-2xl"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex w-full mt-1 text-[14px] text-gray-600">
                          <span className="flex-1 text-center">Rất Tệ</span>
                          <span className="flex-1 text-center">Tệ</span>
                          <span className="flex-1 text-center">Bình thường</span>
                          <span className="flex-1 text-center">Tốt</span>
                          <span className="flex-1 text-center">Tuyệt vời</span>
                        </div>
                      </div>
                    </div>

                    <TextArea
                      rows={4}
                      placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm..."
                      value={review.comment || ""}
                      onChange={(e) => handleReviewChange(productId, "comment", e.target.value)}
                      className="w-full"
                    />

                    <div className="w-full flex justify-between items-center gap-4">
                      <Upload
                        listType="picture-card"
                        maxCount={3}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => handleReviewChange(productId, "images", fileList)}
                      >
                        {(!review.images || review.images.length < 3) && (
                          <div className="text-sm flex flex-col items-center">
                            <CameraOutlined />
                            <div className="mt-1">Thêm ảnh</div>
                          </div>
                        )}
                      </Upload>
                    </div>
                    <div className="w-full text-right">
                      <Button
                        icon={<SendOutlined />}
                        style={{
                          backgroundColor: "#1e3a8a",
                          borderColor: "#1e3a8a",
                          color: "white",
                        }}
                        className="cursor-pointer hover:shadow-lg"
                        onClick={() => handleSubmitReview(productId)}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                    
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Review;