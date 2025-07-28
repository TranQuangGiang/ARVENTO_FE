import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Button, Image, message, Rate, Upload, Input, Popconfirm } from "antd";
import { HeartFilled, HeartOutlined, UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useOneData } from "../../hooks/useOne";
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from "jwt-decode";
import { useCart } from "../contexts/cartContexts";
import axios from "axios";
import type { UploadProps } from "antd";
import dayjs from "dayjs";

const DeltaiProduct = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [variants, setVariants] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  // New state for current price
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  // New states for variant original and sale prices
  const [variantOriginalPrice, setVariantOriginalPrice] = useState<number>(0);
  const [variantSalePrice, setVariantSalePrice] = useState<number>(0);

  const { addToCart } = useCart();
  const { id } = useParams();
  const { data: productDetail } = useOneData({ resource: '/products', _id: id });
  const product = productDetail?.data;

  const uploadProps: UploadProps = {
    beforeUpload: () => false,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
  };

  useEffect(() => {
    const fetchVariants = async () => {
      if (!product?._id) return;
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:3000/api/variants/products/${id}/variants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedVariants = res.data?.data?.data || [];
        setVariants(fetchedVariants);

        // Set initial selected color and size from the first variant if available
        if (fetchedVariants.length > 0) {
          const firstColor = fetchedVariants[0]?.color?.name;
          setSelectedColor(firstColor);

          // Find the first size for the initial color
          const firstSizeForColor = fetchedVariants.find((v: any) => v.color.name === firstColor)?.size;
          setSelectedSize(firstSizeForColor || null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy variants:", error);
        setVariants([]);
      }
    };
    fetchVariants();
  }, [product]);

  useEffect(() => {
    if (!product || variants.length === 0) return;

    // Update selectedImage when selectedColor changes
    const colorIndex = Array.from(new Set(variants.map(v => v.color.name))).indexOf(selectedColor);
    const filteredImages = product.images?.slice(colorIndex * 5, colorIndex * 5 + 5) || [];
    setSelectedImage(filteredImages[0]?.url || "");

    // Update currentPrice and selectedSize when selectedColor changes
    // If a color is selected, default to the first available size for that color, or null if no sizes for that color
    const sizesForSelectedColor = variants.filter(v => v.color.name === selectedColor).map(v => v.size);
    if (selectedColor && sizesForSelectedColor.length > 0 && !sizesForSelectedColor.includes(selectedSize)) {
      setSelectedSize(sizesForSelectedColor[0]);
    } else if (selectedColor && sizesForSelectedColor.length === 0) {
      setSelectedSize(null);
    }

  }, [selectedColor, product, variants]);

  // Effect to update prices based on selectedColor and selectedSize
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const selectedVariant = variants.find(
        (v) => v.color.name === selectedColor && v.size === selectedSize
      );

      if (selectedVariant) {
        const original = Number(selectedVariant.price?.$numberDecimal || 0);
        const sale = Number(selectedVariant.sale_price?.$numberDecimal || 0);

        setVariantOriginalPrice(original);
        setVariantSalePrice(sale);

        // Set currentPrice based on sale price if available and greater than 0, otherwise original
        if (sale > 0 && sale < original) {
          setCurrentPrice(sale);
        } else {
          setCurrentPrice(original);
        }
      } else {
        setVariantOriginalPrice(0);
        setVariantSalePrice(0);
        setCurrentPrice(0);
      }
    } else if (product) {
      // Fallback to product's sale_price/original_price if no variant is selected
      const productOriginal = typeof product.original_price === 'object' && product.original_price?.$numberDecimal
        ? Number(product.original_price.$numberDecimal)
        : product.original_price || 0;

      const productSale = typeof product.sale_price === 'object' && product.sale_price?.$numberDecimal
        ? Number(product.sale_price.$numberDecimal)
        : product.sale_price || 0;

      setVariantOriginalPrice(productOriginal);
      setVariantSalePrice(productSale);

      if (productSale > 0 && productSale < productOriginal) {
        setCurrentPrice(productSale);
      } else {
        setCurrentPrice(productOriginal);
      }
    }
  }, [selectedColor, selectedSize, variants, product]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/reviews/product/${product._id}`);
        console.log("REVIEW RESPONSE", res.data);
        const reviewData = res.data?.data?.reviews || [];

        // Chỉ hiển thị các review đã được duyệt và không bị ẩn
        const filtered = reviewData.filter((r: any) => r.approved === true && r.hidden === false);
        setReviews(filtered);
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
        setReviews([]);
      }
    };
    if (product?._id) {
      fetchReviews();
    }
  }, [product]);


  const colorNames = Array.from(new Set(variants.map(v => v.color.name)));
  const sizes = variants.filter(v => v.color.name === selectedColor).map(v => v.size);
  const colorIndex = colorNames.indexOf(selectedColor);
  const filteredImages = product?.images?.slice(colorIndex * 5, colorIndex * 5 + 5) || [];
  const currentStock = variants.find(v => v.color.name === selectedColor && v.size === selectedSize)?.stock || 0;

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price?.$numberDecimal) {
      return Number(price.$numberDecimal).toLocaleString();
    }
    if (typeof price === 'number') {
      return price.toLocaleString();
    }
    return 'Liên hệ';
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize || !product || quantity <= 0) return;
    const token = localStorage.getItem("token");
    const userInfo: any = token ? jwtDecode(token) : null;
    const userId = userInfo?.id;
    if (!userId) return message.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");

    const variant = variants.find((v: any) => v.color.name === selectedColor && v.size === selectedSize);
    console.log(variant);
    
    if (!variant) return;

    console.log("currentPrice khi thêm vào giỏ:", currentPrice);
    console.log("variantOriginalPrice:", variantOriginalPrice);
    console.log("variantSalePrice:", variantSalePrice);

    // Use currentPrice for the unit price
    const unitPrice = currentPrice;

    const cartItem = {
      userId,
      product: product._id,
      product_id: product._id,
      product_name: product.name,
      selected_variant: {
        sku: variant.sku,                 // SKU từ variant
        price: variant.price?.$numberDecimal || 0, // Giá sản phẩm (dưới dạng number)
        stock: variant.stock || 0,        // Số lượng tồn kho
        color: variant.color,
        size: String(selectedSize),
        image: {
          url: selectedImage,
          alt: `Hình ảnh sản phẩm ${product.name}`
        },
      },
      quantity,
      unit_price: unitPrice,
      total_price: unitPrice * quantity,
    };
    try {
      setLoading(true);
      await addToCart(cartItem);
    }
    catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.";

      message.error(errorMsg);
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Vui lòng đăng nhập để đánh giá.");
    let userInfo: any = null;
    try {
      userInfo = jwtDecode(token);
    } catch (err) {
      return message.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
    }
    if (!userInfo?.id) return message.warning("Vui lòng đăng nhập để đánh giá.");
    if (!userRating || !userComment.trim()) return message.warning("Vui lòng nhập đủ thông tin.");

    const formData = new FormData();
    formData.append("rating", userRating.toString());
    formData.append("comment", userComment);
    formData.append("product_id", product._id);

    console.log("Đang gửi đánh giá:", {
      rating: userRating,
      comment: userComment,
      product_id: product._id,
      images: fileList.map(f => f.name || f.originFileObj?.name),
    });

    fileList.forEach((file) => {
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
      setUserRating(0);
      setUserComment("");
      setFileList([]);

      const res = await axios.get(`http://localhost:3000/api/reviews/product/${product._id}`);
      const reviewData = res.data?.data?.reviews;
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    } catch (error: any) {
      console.error(error);
      message.error(error?.response?.data.message);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return message.error("Bạn chưa đăng nhập.");
    try {
      await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Đã xóa đánh giá!");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      message.error("Xóa đánh giá thất bại!");
    }
  };

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded?.id || null);
      } catch (err) {
        setUserId(null);
      }
    }
  }, []);

  // State
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra sản phẩm đã được yêu thích hay chưa
  useEffect(() => {
    if (!product?._id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchFavoriteStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/favorites/check/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("❤️ Trạng thái yêu thích:", res.data?.data?.isFavorited);
        setIsFavorite(res.data?.data?.isFavorited || false);
      } catch (err) {
        console.error("❌ Không kiểm tra được trạng thái yêu thích", err);
      }
    };

    fetchFavoriteStatus();
  }, [product?._id]);




  // Xử lý thêm vào yêu thích
  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Bạn cần đăng nhập để yêu thích sản phẩm.");
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/favorites/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
        message.success("Đã bỏ yêu thích sản phẩm!");
      } else {
        await axios.post(
          `http://localhost:3000/api/favorites`,
          { product_id: product._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavorite(true);
        message.success("Đã thêm vào yêu thích!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
      message.error("Thao tác không thành công!");
    }
  };




  if (!product) return <p className="text-center mt-10">Đang tải sản phẩm...</p>;

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full h-64  relative">
        <img
          src="/images/banerDeltai.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tto-transparent flex items-center justify-center">
          <h2 className="text-center  text-xl md:text-2xl lg:text-[30px] font-bold text-white px-4">
            {product.name}
          </h2>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ảnh sản phẩm */}
          <div className="w-full flex flex-col items-center">
            <AnimatePresence>
              <div className="w-full overflow-hidden relative">
                {selectedImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    key={selectedImage}
                  >
                    <Image
                      className="w-full h-full object-cover"
                      src={selectedImage}
                      alt={product.name}
                      preview={true}
                    />
                  </motion.div>
                )}
              </div>

            </AnimatePresence>
            <div className="flex space-x-2 mt-4 flex-wrap justify-center">
              {filteredImages.map((img: any, i: number) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`thumb-${i}`}
                  className={`w-14 h-14 object-cover cursor-pointer border ${selectedImage === img.url ? "border-blue-600" : "border-gray-300"}`}
                  onClick={() => setSelectedImage(img.url)}
                />
              ))}
            </div>
          </div>
          {/* Thông tin chi tiết */}
          <div className="w-full flex flex-col">
            <h4 className="text-lg md:text-[22px] font-bold text-[#01225a] mb-2">
              {product.name}
            </h4>
            <span className="flex items-center mt-1">
              <p className="border-b text-[14px] font-sans uppercase gap-2 border-b-gray-300">
                {product.slug}
              </p>
              <div className="ml-4 mb-0 flex flex-wrap gap-12">
                <span className="text-[14px] font-sans uppercase">
                  <strong>SKU:</strong> {product.product_code}
                </span>
              </div>
            </span>
            <span className="price mt-5 flex items-center">
              <h6 className="text-[20px] font-sans font-medium text-[#01225a]">
                Price:
              </h6>
              {/* Conditional price display */}
              {variantSalePrice > 0 && variantSalePrice < variantOriginalPrice ? (
                <>
                  <p className="ml-4 font-sans text-[17px] font-medium text-red-600">
                    {formatPrice(variantSalePrice)}
                    <sup>đ</sup>
                  </p>
                  <del className="font-sans text-[17px] font-semibold ml-6 text-gray-400">
                    {formatPrice(variantOriginalPrice)}
                    <sup>đ</sup>
                  </del>
                </>
              ) : (
                <p className="ml-4 font-sans text-[17px] font-medium">
                  {formatPrice(variantOriginalPrice)}
                  <sup>đ</sup>
                </p>
              )}
            </span>

            {/* Chọn màu */}
            <div className="mb-6 mt-9">
              <span className="text-[15px] font-medium text-[#01225a] block mb-2">
                Color: {selectedColor}
              </span>
              <div className="flex flex-wrap gap-4">
                {/* Hiển thị 1 ảnh đại diện cho mỗi màu */}
                {colorNames.map((color, i) => {
                  const firstImg = product.images?.[i * 5]?.url || "";
                  return (
                    <img
                      key={color}
                      src={firstImg}
                      alt={color}
                      className={`w-[50px] h-[50px] cursor-pointer object-cover rounded border ${selectedColor === color ? "border-blue-600" : "border-gray-300"}`}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedImage(firstImg);
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Chọn size */}
            <div className="mt-1 mb-6 bg-[#f7f7f7] p-4 rounded-[6px]">
              <div className="mb-6 bg-[#efefef] p-3.5 rounded transition-all duration-100 hover:bg-[#ebebeb]">
                <div className="flex flex-wrap items-center gap-2 mb-0">
                  <span className="text-[#01225a] text-[15px] font-medium mr-2">
                    Size:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(size)}
                        className={`px-2.5 py-0.5 cursor-pointer border rounded ${selectedSize === size ? "bg-blue-900 text-white" : "bg-white text-gray-800"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Hiển thị stock chỉ khi đã chọn size */}
              {selectedSize !== null && (
                <p className={`text-sm mt-2 ${
                  currentStock > 0 ? "text-green-500" : "text-red-500"
                  }`}>
                  {currentStock} in stock
                </p>
              )}
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-5">
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={currentStock}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 sm:w-16 border px-2 py-1 text-center border-[#01225a] outline-0"
                />
                <Button
                  style={{
                    background: "#01225a",
                    color: "white",
                    fontSize: "14px",
                    height: 40,
                    width: 200
                  }}
                  loading={loading}
                  onClick={handleAddToCart}
                  disabled={selectedSize === null || currentStock <= 0}
                >
                  ADD TO CART
                </Button>
                <Button
                  type="text"
                  icon={isFavorite ? <HeartFilled style={{ color: "red", fontSize: 24 }} /> : <HeartOutlined style={{ fontSize: 24 }} />}
                  onClick={handleToggleFavorite}
                />
              </div>

              {/* Thông tin bảo hành/giao hàng */}
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex items-center gap-1 text-[15px]">
                  <FontAwesomeIcon
                    className="text-[24px] text-[#01225a]"
                    icon={faShieldHalved}
                  />
                  <p className="font-sans font-bold text-[#01225a] ml-1.5">
                    SAFETY INSURANCE
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    className="text-[24px] text-[#01225a]"
                    icon={faTruckFast}
                  />
                  <p className="font-sans font-bold text-[#01225a] ml-1.5">
                    FREE DELIVERY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-product w-[70%] mx-auto">
        <div
          className="font-sans text-[16px] text-[#01225a] mb-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
      <div className="content-product w-[70%] mx-auto">

        {/* Review Section */}
        <div className="mt-10 border-t pt-8">
          <h3 className="text-xl font-bold text-[#01225a] mb-5">Đánh giá sản phẩm</h3>

          {reviews.length === 0 ? (
            <p className="text-gray-600">Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((r, idx) => (
              <div key={idx} className="mb-6 border-b pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#2d0d0d] text-white flex items-center justify-center text-sm font-sans font-semibold">
                      {typeof r.user_id === 'object' && r.user_id.name ? r.user_id.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <span className="font-semibold text-[#01225a] ml-2">
                      {typeof r.user_id === 'object' ? r.user_id.name : "Ẩn danh"}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400">{dayjs(r.created_at).format("DD/MM/YYYY")}</span>
                    {userId && typeof r.user_id === "object" && r.user_id._id === userId && (
                      <Popconfirm
                        title="Bạn chắc chắn muốn xóa đánh giá này?"
                        onConfirm={() => handleDeleteReview(r._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button size="small" danger>Xóa</Button>
                      </Popconfirm>
                    )}
                  </div>
                </div>

                <Rate disabled defaultValue={r.rating} className="mt-1" />
                <p className="mt-2 text-gray-700">{r.comment}</p>

                {r.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.images.map((img: any, i: any) => (
                      <img
                        key={i}
                        src={img}
                        className="w-16 h-16 rounded border object-cover"
                        alt={`review-img-${i}`}
                      />
                    ))}
                  </div>
                )}

                {/* Nếu có phản hồi từ admin */}
                {r.reply && (
                  <div className="mt-3 p-2 border-l-4 border-blue-600 bg-blue-50 text-sm text-[#01225a]">
                    <strong>Phản hồi từ Admin:</strong> {r.reply}
                  </div>
                )}
              </div>
            ))
          )}


          <div className="mt-8 p-5 bg-gray-50 rounded-md">
            <h4 className="text-lg font-semibold text-[#01225a] mb-3">Viết đánh giá</h4>
            <div className="mb-3">
              <label className="block text-sm mb-1">Đánh giá của bạn:</label>
              <Rate onChange={setUserRating} value={userRating} />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Nhận xét:</label>
              <Input.TextArea rows={4} value={userComment} onChange={(e) => setUserComment(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Hình ảnh:</label>
              <Upload {...uploadProps} listType="picture-card" multiple>
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
              </Upload>
            </div>
            <Button type="primary" onClick={handleSubmitReview} style={{ background: "#01225a", borderColor: "#01225a" }}>Gửi đánh giá</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeltaiProduct;