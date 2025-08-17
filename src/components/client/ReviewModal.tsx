import { useEffect, useState } from "react";
import { Modal, Rate, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const ReviewModal = ({ visible, onCancel, order, userId }: any) => {
  const [reviewData, setReviewData] = useState<any>({});

  useEffect(() => {
    if (!visible || !order?._id) return;

    const fetchExistingReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/review/order/${order._id}`
        );
        const reviews = res.data;
        const mapped: any = {};
        reviews.forEach((rv: any) => {
          mapped[rv.product._id] = {
            rating: rv.rating,
            comment: rv.comment,
            images: (rv.images || []).map((url: string, index: number) => ({
              uid: `${index}`,
              name: `image-${index}.jpg`,
              status: "done",
              url,
            })),
          };
        });
        setReviewData(mapped);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá đã có:", error);
      }
    };

    fetchExistingReviews();
  }, [order, visible]);

  const handleRatingChange = (productId: string, value: number) => {
    setReviewData((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        rating: value,
      },
    }));
  };

  const handleCommentChange = (productId: string, e: any) => {
    setReviewData((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        comment: e.target.value,
      },
    }));
  };

  const handleImageChange = (productId: string, fileList: any) => {
    setReviewData((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        images: fileList,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const item of order.items) {
        const productId = item.product._id;
        const data = reviewData[productId];
        if (!data) continue;

        const formData = new FormData();
        formData.append("product", productId);
        formData.append("order", order._id);
        formData.append("user", userId);
        formData.append("rating", data.rating);
        formData.append("comment", data.comment);

        (data.images || []).forEach((file: any) => {
          if (!file.url) formData.append("images", file.originFileObj);
        });

        await axios.post("http://localhost:3000/api/review", formData);
      }

      message.success("Gửi đánh giá thành công!");
      onCancel();
    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
      message.error("Gửi đánh giá thất bại!");
    }
  };

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okText="Gửi"
      cancelText="Hủy"
      destroyOnClose
    >
      {order?.items?.map((item: any) => {
        const productId = item.product._id;
        const currentReview = reviewData[productId] || {};

        return (
          <div key={productId} className="mb-6 border-b pb-6">
            <div className="flex gap-4 mb-4">
              <img
                src={
                  item.product.image ||
                  item.product.images?.[0] ||
                  item.product.thumbnail ||
                  "/no-image.jpg"
                }
                alt="Product"
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h4 className="text-lg font-semibold">{item.product.name}</h4>
                <p>Số lượng: {item.quantity}</p>
              </div>
            </div>
            <div className="mb-3">
              <span className="font-medium">Đánh giá:</span>
              <Rate
                value={currentReview.rating || 0}
                onChange={(value) => handleRatingChange(productId, value)}
              />
            </div>
            <div className="mb-3">
              <span className="font-medium">Nhận xét:</span>
              <TextArea
                rows={3}
                value={currentReview.comment || ""}
                onChange={(e) => handleCommentChange(productId, e)}
              />
            </div>
            <div>
              <span className="font-medium">Hình ảnh:</span>
              <Upload
                listType="picture-card"
                fileList={currentReview.images || []}
                onChange={({ fileList }) => handleImageChange(productId, fileList)}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Chỉ được tải lên hình ảnh!");
                  }
                  return isImage || Upload.LIST_IGNORE;
                }}
                onPreview={(file) => window.open(file.url || file.thumbUrl)}
              >
                {(!currentReview.images || currentReview.images.length < 5) && "+ Ảnh"}
              </Upload>
            </div>
          </div>
        );
      })}
    </Modal>
  );
};

export default ReviewModal;
