import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Rate, Input, Upload, Button, message, Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
const { TextArea } = Input;

const Review = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
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

  const handleReviewChange = (productId: string, field: string, value: string) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const resetAllReviews = () => {
    const newReviews = {};
    uniqueProducts.forEach((item) => {
      newReviews[item.product._id] = {
        rating: 0,
        comment: "",
        images: [],
      };
    });
    setReviews(newReviews);
  };

  const handleSubmitReview = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Vui lòng đăng nhập để đánh giá.");
    let userInfo = null;
    try {
      userInfo = jwtDecode(token);
    } catch (err) {
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

    review.images?.forEach((file) => {
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

      await axios.get(`http://localhost:3000/api/reviews/product/${productId}`);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data.message);
    }
  };

  if (loading) return <Spin className="mt-10" />;
  if (!order) return <div className="p-6 text-gray-500">No order data available.</div>;

  const productQuantityMap = order.items.reduce((acc, item) => {
    const productId = item.product._id;
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
        <h2 className="text-lg font-semibold text-center uppercase tracking-wide text-[#01225a] bg-gray-100 py-3 border-b-2 border-[#01225a]">
          Product Reviews
        </h2>

        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm mt-6">
          {uniqueProducts.map((item, index) => {
            const productId = item.product._id;
            const review = reviews[productId] || {};

            return (
              <div key={productId} className="mb-10">
                {index > 0 && <hr className="border-gray-300 w-full mb-6" />}
                <div className="flex items-start gap-4">
                  <img
                    src={item.selected_variant?.image?.url || item.product?.images?.[0]?.url}
                    alt=""
                    className="w-20 h-20 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-base text-gray-800">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          x{item.quantity} - <span className="text-red-500 font-semibold">{(item.unit_price * item.quantity).toLocaleString()}₫</span>
                        </p>
                      </div>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        className="rounded-md font-medium bg-green-500 border-green-500 hover:bg-green-600"
                        onClick={() => handleSubmitReview(productId)}
                      >
                        Submit
                      </Button>
                    </div>

                    <hr className="border-gray-200 my-4 w-full" />

                    <div className="flex flex-col gap-4 items-start w-full">
                      <div className="mb-2">
                        <span className="font-medium">Product Quality</span>
                        <Rate
                          value={review.rating || 0}
                          onChange={(value) => handleReviewChange(productId, "rating", value)}
                          className="ml-2"
                        />
                      </div>

                      <Upload
                        listType="picture-card"
                        maxCount={3}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => handleReviewChange(productId, "images", fileList)}
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
