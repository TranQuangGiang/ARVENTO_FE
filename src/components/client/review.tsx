import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Rate, Input, Upload, Button, message, Spin } from "antd";
import { SendOutlined, CameraOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

const { TextArea } = Input;

const Review = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [userId, setUserId] = useState(null);
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setUserId(decoded.id);
      } catch {
        console.error("Invalid token");
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
        message.error("Unable to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

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
          uniqueProducts.map((item) =>
            axios.get(`http://localhost:3000/api/reviews/product/${item.product._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const submitted = {};
        uniqueProducts.forEach((item, index) => {
          const productId = item.product._id;
          const productReviews = responses[index]?.data?.data?.reviews || [];

          const userHasReviewed = productReviews.some((review: any) => {
            const reviewUser =
              review.user_id?._id || review.user_id?.id || review.user_id || review.user?._id;
            return reviewUser === userId;
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

  const handleReviewChange = (productId: any, field: any, value: any) => {
    setReviews((prev) => ({
  const handleReviewChange = (productId: string, field: string, value: string) => {
    setReviews((prev:any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const resetAllReviews = () => {
    const newReviews = {};
    uniqueProducts.forEach((item: any) => {
    uniqueProducts.forEach((item:any) => {
      newReviews[item.product._id] = {
        rating: 5, 
        comment: "",
        images: [],
      };
    });
    setReviews(newReviews);
  };

  const handleSubmitReview = async (productId:any) => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Vui lòng đăng nhập để đánh giá.");

    let userInfo = null;
    try {
      userInfo = jwtDecode(token);
    } catch {
      return message.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }

    if (!userInfo?.id) return message.warning("Vui lòng đăng nhập để đánh giá.");

    const review = reviews[productId];
    if (!review || !review.rating || !review.comment?.trim()) {
      return message.warning("Vui lòng nhập đủ thông tin.");
    }

    const formData = new FormData();
    formData.append("rating", review.rating);
    formData.append("comment", review.comment);
    formData.append("product_id", productId);

    review.images?.forEach((file: any) => {
    review.images?.forEach((file:any) => {
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
      resetAllReviews();
      setSubmittedReviews((prev) => ({
        ...prev,
        [productId]: true,
      }));
    } catch (error) {

      await axios.get(`http://localhost:3000/api/reviews/product/${productId}`);
    } catch (error:any) {
      console.error(error);
      message.error(error?.response?.data?.message || "Lỗi khi gửi đánh giá.");
    }
  };

  if (loading) return <Spin className="mt-10" />;
  if (!order) return <div className="p-6 text-gray-500">Không có dữ liệu đơn hàng.</div>;
  if (!order) return <div className="p-6 text-gray-500">No order data available.</div>;

  const productQuantityMap = order?.items.reduce((acc:any, item:any) => {
    const productId = item.product?._id;
    if (!acc[productId]) {
      acc[productId] = { ...item, quantity: 0 };
    }
    acc[productId].quantity += item.quantity;
    return acc;
  }, {});

  const uniqueProducts = Object.values(productQuantityMap);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-semibold tracking-wide text-[#01225a] py-3 border-b-2 border-[#01225a] text-2xl">
          Đánh giá & nhận xét
        </h1>
        
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mt-2">
          {uniqueProducts.map((item: any, index: any) => {
            const productId = item.product._id;
            const review = reviews[productId] || {}; 
            const isSubmitted = submittedReviews[productId];
        <h2 className="text-lg font-semibold text-center uppercase tracking-wide text-[#01225a] bg-gray-100 py-3 border-b-2 border-[#01225a]">
          Product Reviews
        </h2>

        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mt-6">
          {uniqueProducts.map((item:any, index) => {
            const productId = item.product?._id;
            const review = reviews[productId] || {};

            return (
              <div key={productId} className="mb-10 -mt-3">
                <div className="flex justify-end mb-4">
                  <Link to="/detailAuth/orderHistory">
                    <CloseOutlined  className="text-[#01225a] text-2xl cursor-pointer hover:text-[#0f3fb6]" />
                  </Link>
                </div>

                {index > 0 && <hr className="border-gray-300 w-full mb-6" />}
                <div className="flex items-start gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex gap-4 items-start">
                      <img
                        src={item.selected_variant?.image?.url || item.product?.images?.[0]?.url}
                        alt=""
                        className="w-20 h-20 object-cover rounded border border-gray-200"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-semibold text-lg md:text-xl text-gray-800 mt-3">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              x{item.quantity} -{" "}
                              <span className="text-red-500 font-semibold">
                                {(item.unit_price * item.quantity).toLocaleString()}₫
                              </span>
                            </p>
                          </div>

                          {!isSubmitted && (
                            <Button
                              icon={<SendOutlined />}
                              style={{
                                backgroundColor: "#1e3a8a", 
                                borderColor: "#1e3a8a",
                                color: "white",
                              }}
                              onClick={() => handleSubmitReview(productId)}
                            >
                              Gửi đánh giá
                            </Button>

                          )}
                        </div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-base text-gray-800">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          x{item?.quantity} - <span className="text-red-500 font-semibold">{(item.unit_price * item.quantity).toLocaleString()}₫</span>
                        </p>
                      </div>
                    </div>

                    {isSubmitted ? (
                      <p className="text-green-600 font-medium italic mt-4">
                        Bạn đã đánh giá sản phẩm này.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4 items-start w-full mt-7 px-2">
                        <div className="w-full">
                          <h3 className="font-bold mb-1">Đánh giá chung</h3>

                          <div className="w-full mt-3">
                            <div className="flex w-full">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star} className="flex-1 flex justify-center">
                                  <Rate
                                    value={review.rating >= star ? 1 : 0}
                                    onChange={() =>
                                      handleReviewChange(productId, "rating", star)
                                    }
                                    count={1}
                                    className="text-2xl"
                                  />
                                </div>
                              ))}
                            </div>  

                            <div className="flex w-full mt-1 text-xs text-gray-600">
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
                          onChange={(e) =>
                            handleReviewChange(productId, "comment", e.target.value)
                          }
                          className="w-full"
                        />

                        <div className="w-full">
                          <Upload
                            listType="picture-card"
                            maxCount={3}
                            beforeUpload={() => false}
                            onChange={({ fileList }) =>
                              handleReviewChange(productId, "images", fileList)
                            }
                          >
                            {(!review.images || review.images.length < 3) && (
                              <div>
                                <CameraOutlined  />
                                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                              </div>
                            )}
                          </Upload>
                        </div>
                      </div>
                    )}
                      <Upload
                        listType="picture-card"
                        maxCount={3}
                        beforeUpload={() => false}
                        onChange={({ fileList }:any) => handleReviewChange(productId, "images", fileList)}
                      >
                        {(!review.images || review.images.length < 3) && (
                          <div className="text-sm">+ Upload</div>
                        )}
                      </Upload>

                      <TextArea
                        rows={4}
                        placeholder="Share your thoughts about this product"
                        value={review.comment || ""}
                        onChange={(e) => handleReviewChange(productId, "comment", e.target.value)}
                        className="rounded-md w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Review;
