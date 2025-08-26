import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Button, Image, message, Rate, Popconfirm, Modal } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useOneData } from "../../hooks/useOne";
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from "jwt-decode";
import { useCart } from "../contexts/cartContexts";
import axios from "axios";
import dayjs from "dayjs";
import { useList } from "../../hooks/useList";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Clock, User } from "lucide-react";
import UpdateReview from "./UpdateReview";
import FadeInWhenVisible from "../animations/FadeInWhenVisible";

const colors = [
  "#5E35B1", // Deep Purple 500 (màu tím đậm nhưng không quá chói)
  "#388E3C", // Green 600 (xanh lá cây đậm vừa)
  "#D84315", // Deep Orange 700 (cam đậm)
  "#1976D2", // Blue 700 (xanh dương đậm vừa)
  "#827717", // Lime 900 (vàng ô liu đậm)
  "#00838F", // Cyan 600 (xanh lơ đậm vừa)
  "#AD1457", // Pink 700 (hồng đậm vừa)
  "#6D4C41", // Brown 600 (nâu vừa)
  "#455A64", // Blue Grey 600 (xám xanh đậm vừa)
  "#7B1FA2", // Purple 700 (tím vừa)
  "#E64A19", // Orange 600 (cam vừa)
  "#2E7D32", // Green 800 (xanh lá đậm)
  "#1565C0", // Blue 800 (xanh dương đậm)
  "#9E9D24", // Lime A700 (vàng chanh đậm)
  "#006064"  // Teal 800 (xanh két đậm)
];


const stringToColor = (str:any) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const DeltaiProduct = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [variants, setVariants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  // New state for current price
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  // New states for variant original and sale prices
  const [variantOriginalPrice, setVariantOriginalPrice] = useState<number>(0);
  const [variantSalePrice, setVariantSalePrice] = useState<number>(0);
  const desc = ['Rất Tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

  // Cập nhập review
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [rewiewId, setReviewId] = useState<any>(null);

  const handleOpenReviewModal = (reviewId: string) => {
    setReviewId(reviewId)
    setIsReviewModalVisible(true);
  }

  const handleCloseReviewModal = () => {
    setIsReviewModalVisible(false);
    setReviewId(null);
  };

  const { addToCart } = useCart();
  const { id } = useParams();
  const { data: productDetail } = useOneData({ resource: '/products', _id: id });
  const product = productDetail?.data;

  const { data:relatedProducts } = useList({
    resource: `/products/related/${id}`
  });

  const productsRelated = (relatedProducts?.data || []).filter((p:any) => p.isActive); 
  const productData = [...productsRelated]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 7);
  console.log("Sản phẩm liên quan", relatedProducts);
  
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
    if (isReviewModalVisible === false) {
      fetchReviews();
      
    }
  }, [product, isReviewModalVisible]);


  const colorNames = Array.from(new Set(variants.map(v => v.color.name)));
  console.log("color name: ", colorNames);
  
  const sizes = variants.filter(v => v.color.name === selectedColor).map(v => v.size);
  const colorIndex = colorNames.indexOf(selectedColor);
  console.log("color index: ", colorIndex);
  
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

  // tính phần trăm giảm giá
  const percentDiscount = Math.round(((variantOriginalPrice - variantSalePrice) / variantOriginalPrice) * 100);
  console.log(percentDiscount);

  const [ratingFilter, setRatingFilter] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);

  useEffect(() => {
    if (ratingFilter === null) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter((r) => r.rating === ratingFilter));
    }
  }, [reviews, ratingFilter]);


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
      <div className="max-w-[76%] mx-auto mt-10">
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
            <div className="flex space-x-2 flex-wrap justify-center mt-5">
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
              {product.name} - {selectedColor} 
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
                Giá:
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
                  <span className="ml-6 w-12 h-9 justify-center bg-blue-900 text-white font-sans font-semibold rounded text-[17px] flex items-center">{percentDiscount + "%"}</span>
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
                Màu sắc: {selectedColor}
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
                    Kích thước:
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
                <p className={`text-sm mt-2 flex items-center gap-1.5 ${
                  currentStock > 0 ? "text-green-500" : "text-red-500"
                  }`}>
                  <span className="text-gray-600">Kho:</span>  {currentStock} 
                </p>
              )}
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-5">
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={currentStock}
                  onChange={(e:any) => setQuantity((e.target.value))}
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
                  Thêm vào giỏ hàng
                </Button>
                <Button
                  type="text"
                  className="relative flex items-center justify-center p-0"
                  onClick={handleToggleFavorite}
                >
                  <AnimatePresence 
                    mode="wait" initial={false}
                  >
                    { isFavorite ? (
                      <motion.div
                        key="heartFilled"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0, scale: 0.5}}
                        transition={{type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.3, 1],
                          transition: {
                              duration: 0.7, // Tăng thời gian để hiệu ứng mượt hơn
                              ease: "easeInOut",
                              repeat: Infinity, // Lặp lại vô hạn
                              repeatType: "loop" // Lặp lại từ đầu mỗi lần
                          }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute group"
                      >
                        <HeartFilled style={{color: "red", fontSize: 24, }} />
                      </motion.div>
                    ): (
                      <motion.div
                        key="heartOutlined"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        whileHover={{
                          scale: [1, 1.2, 1],
                          transition: {
                              duration: 0.8, // Tăng thời gian để hiệu ứng mượt hơn
                              ease: "easeInOut",
                              repeat: Infinity, // Lặp lại vô hạn
                              repeatType: "loop" // Lặp lại từ đầu mỗi lần
                          }
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute"
                      >
                        <HeartOutlined style={{ fontSize: 24 }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>

              {/* Thông tin bảo hành/giao hàng */}
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex items-center gap-1 text-[15px]">
                  <FontAwesomeIcon
                    className="text-[24px] text-[#01225a]"
                    icon={faShieldHalved}
                  />
                  <p className="font-sans font-bold text-[#01225a] ml-1.5">
                    BẢO HIỂM AN TOÀN
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <FontAwesomeIcon
                    className="text-[24px] text-[#01225a]"
                    icon={faTruckFast}
                  />
                  <p className="font-sans font-bold text-[#01225a] ml-1.5">
                    GIAO HÀNG NHANH CHÓNG
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FadeInWhenVisible>
        <div className="content-product max-w-[76%] mx-auto mt-[140px]">
          <h3 className="text-[26px] mb-0">Mô tả sản phẩm</h3>
          <div
            className="text-[16px] text-[#01225a] mb-2 ck-content"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </FadeInWhenVisible>
      
      {/* Sản phẩm liên quan */}
      
      <FadeInWhenVisible>
        <div className="max-w-[76%] mx-auto mt-[100px] mb-[80px]">
          <h2 className="mb-4 text-[20px] font-semibold text-[#4A4A4A]">Có thể bạn cũng thích</h2>
          <div className="w-full flex items-center justify-between">
            <div className="w-full">
              <Swiper 
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={40}
                slidesPerView={5}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false
                }}
              >
                {productData.map((product, index) => {
                  const imageIndex = index % 2 === 0 ? 0 : 5;
                  let imageUrl = "/default.png";
                  if (product.images && product.images.length > 0) {
                    if (product.images && product.images.length <= 5) {
                      imageUrl = product.images[0]?.url
                    } else {
                      imageUrl = product.images[imageIndex]?.url
                    }
                  }
                  return (
                    
                    <SwiperSlide>
                      <Link to={`/detailProductClient/${product._id}`} key={product._id}>
                        <div className='list-product-one overflow-hidden w-[215px] h-[300px] bg-[#F2f2f2] flex flex-col items-center justify-center cursor-pointer group'>
                          <div className='w-[200px] h-[160px] overflow-hidden flex items-center'>
                            <img
                              className='w-[220px] h-[220px] mt-0 transition-all duration-300 group-hover:scale-[1.1]'
                              src={imageUrl}
                              alt={product.name}
                            />
                          </div>
                          <div className='content w-[80%] mt-[0px]'>
                            <h4 className='w-full text-[15px] font-semibold font-sans text-black leading-[18px] h-[38px] overflow-hidden line-clamp-2'>
                              {product.name}
                            </h4>
                            <div className='pt-1.5 flex items-center'>
                              <p className='font-sans font-semibold text-[#0b1f4e] text-[14px]'>
                                {formatPrice(product.original_price)}<sup>đ</sup>
                              </p>
                            </div>
                          </div>
                          <div className='mt-2 text-[13px] uppercase w-[80%] mx-auto border-b-1'>
                            <p>Select options</p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
                })}
                
              </Swiper>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
      
      <FadeInWhenVisible>
        <div className="reviews-product max-w-[76%] mx-auto mb-12">
        {/* Review Section */}
          <div className="mt-10 bg-gray-100 pt-3 pb-3 rounded-lg shadow-sm">
            <div className="px-6 w-[98%] bg-white mx-auto rounded-lg">
              <h2 className="text-lg font-semibold  uppercase tracking-wide text-[#01225a] py-3 border-b-2 border-[#01225a]">
                Đánh giá sản phẩm
              </h2> <br />
              {/* Lọc đánh giá */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setRatingFilter(null)}
                  className={`px-3 py-1 border rounded-full transition-all duration-200
                    ${ratingFilter === null ? "bg-blue-900 text-white border-white" : "bg-gray-100 text-gray-800 border-gray-300"}
                  `}
                >
                  Tất cả ({reviews.length})
                </button>
                {[5, 4, 3, 2, 1].map((star:any) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const isActive = ratingFilter === star;
                  return (
                    <button
                      key={star}
                      onClick={() => setRatingFilter(star === ratingFilter ? null : star)}
                      className={`flex items-center gap-1 px-3 py-1 border rounded-full transition-all duration-200
                        ${isActive ? "bg-blue-900 text-white border-white" : "bg-gray-100 text-gray-800 border-gray-300"}
                      `}
                    >
                      <Rate disabled defaultValue={star} count={1} />
                      {star} ({count})
                    </button>
                  );
                })}
                
              </div>

              {filteredReviews.length === 0 ? (
                <div className="relative w-full h-full flex items-center flex-col justify-center pt-3 pb-7">
                  <div className="absolute w-[300px] h-[140px] rounded-full bg-blue-500 opacity-30 blur-2xl"></div>
                  <span className="relative z-10 w-full flex flex-col items-center">
                    <img className="w-[130px]" src="/reviews.png" alt="" />
                  </span>
                  <p className="mt-4 text-[13px] font-medium font-sans text-blue-950">Hiện chưa có đánh giá nào.</p>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {(showAllReviews ? filteredReviews : filteredReviews.slice(0, 3)).map((r, id) => (
                      <motion.div
                        key={r._id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div key={id} className="mb-6 border-b border-gray-300 pb-4">
                          <div className="flex justify-between">
                            <div className="flex">
                              <div className="mt-1">
                                <div className="flex items-center mb-3 w-[200px]">
                                  <div 
                                    className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[14px] font-sans font-semibold"
                                    style={{ backgroundColor: stringToColor(r.user_id.name) }}
                                    >
                                    {typeof r.user_id === 'object' && r.user_id.name ? r.user_id.name.charAt(0).toUpperCase() : "A"}
                                  </div>
                                  <span className="font-bold text-[16px] text-gray-800 ml-2">
                                    {typeof r.user_id === 'object' ? r.user_id.name : "Ẩn danh"}
                                  </span>
                                </div>
                                <p className="text-sm ml-1.5 text-gray-400 flex items-center"><Clock style={{width: 15, color: 'gray'}} className="text-gray-700" /> <span className="ml-1.5">{dayjs(r.created_at).format("DD/MM/YYYY")}</span></p>
                              </div>
                              <div className="ml-7">
                                <div className="flex items-center mt-1">
                                  <Rate 
                                    style={{ fontSize: 13 }} 
                                    disabled 
                                    value={r.rating} 
                                    
                                  />
                                  <span className="text-sm ml-2.5 text-gray-600">
                                    {desc[r.rating - 1]} 
                                  </span>
                                </div>
                                <p className="mt-2 text-[14px] max-w-[95%] text-gray-700">{r.comment}</p>

                                {r.images?.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {r.images.map((img: any, i: any) => (
                                      <Image
                                        key={i}
                                        src={img}
                                        style={{width: 64, height: 64,  objectFit: "cover"}}
                                        
                                        alt={`review-img-${i}`}
                                      />
                                    ))}
                                  </div>
                                )}

                                {r.reply && (
                                  <div className="mt-3 p-2 text-[14px] border-l-4 border-blue-600 flex items-center bg-blue-50 text-sm text-[#01225a]">
                                    <span className="w-8 h-8 rounded-[50%] bg-blue-300 flex items-center justify-center"><User style={{width: 19, color: "#003366"}} /></span><strong className="ml-1.5 mr-1"> Admin:</strong> {r.reply}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                              {userId && typeof r.user_id === "object" && r.user_id._id === userId && (
                                <Button 
                                  size="small" 
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300"  
                                  onClick={() => handleOpenReviewModal(r._id)}
                                >
                                  Sửa
                                </Button>
                              )}
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
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredReviews.length > 3 && (
                    <div className="text-center mt-4 pb-4">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Button
                          onClick={() => setShowAllReviews(!showAllReviews)}
                          type="primary"
                          style={{ background: "#01225a" }}
                        >
                          {showAllReviews ? "Thu gọn" : `Xem tất cả ${filteredReviews.length} đánh giá`}
                        </Button>
                      </motion.div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div> <br />
      </FadeInWhenVisible>

      <Modal
        visible={isReviewModalVisible}
        onCancel={handleCloseReviewModal}
        footer={null} // Hide footer buttons
        width={800} // Adjust width as needed
      >
        {rewiewId && (
          <UpdateReview 
            rewiewId={rewiewId}
            onCLose={handleCloseReviewModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default DeltaiProduct;