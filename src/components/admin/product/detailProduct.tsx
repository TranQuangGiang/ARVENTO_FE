import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Button, Image, message } from "antd";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from "jwt-decode";
import { useOneData } from "../../../hooks/useOne";
import axios from "axios";

const DeltaiProductAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [variants, setVariants] = useState<any[]>([]);

  const { id } = useParams();
  const { data: productDetail } = useOneData({ resource: '/products', _id: id });
  const product = productDetail?.data;

  // Khi product load xong, chọn màu đầu tiên và ảnh đầu tiên tương ứng
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

        // Sửa chỗ này
        const variantList = res.data?.data?.data || [];
        console.log(
        variantList.map((v:any) => ({
          color: v.color.name,
          image: v.image.url,
          size: v.size,
          stock: v.stock
        }))
      );
        setVariants(variantList);
      } catch (error) {
        console.error("Lỗi khi lấy variants:", error);
        setVariants([]); // fallback để tránh lỗi .map
      }
    };

    fetchVariants();
  }, [product]);

  useEffect(() => {
    if (!product || variants.length === 0) return;
    const firstColor = variants[0]?.color?.name;
    setSelectedColor(firstColor);
    setSelectedSize(null);

    const colorIndex = Array.from(new Set(variants.map(v => v.color.name))).indexOf(firstColor);
    const filteredImages = product.images?.slice(colorIndex * 5, colorIndex * 5 + 5) || [];
    setSelectedImage(filteredImages[0]?.url || "");
  }, [product, variants])
  
  if (!product) return <p className="text-center mt-10">Đang tải sản phẩm...</p>;
  
  const colorNames = Array.from(new Set(variants.map(v => v.color.name)));
  const sizes = variants.filter(v => v.color.name === selectedColor).map(v => v.size);
  const colorIndex = colorNames.indexOf(selectedColor);
  const filteredImages = product.images?.slice(colorIndex * 5, colorIndex * 5 + 5) || [];
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

  return (
    <div className="w-full">

      {/* Nội dung chính */}
      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ảnh sản phẩm */}
          <div className="w-full flex flex-col items-center">
            <AnimatePresence>
              <div className="w-full overflow-hidden relative">
                  {selectedImage && (
                    <motion.div
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                      transition={{duration: 0.4}}
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
              <p className="ml-4 font-sans text-[17px] font-medium">
                {formatPrice(product.original_price)}
                <sup>đ</sup>
              </p>
              <del className="font-sans text-[17px] font-semibold ml-6 text-gray-400">
                {formatPrice(product.sale_price)}
                <sup>đ</sup>
              </del>
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
                      className={`w-[50px] h-[50px] object-cover rounded border ${selectedColor === color ? "border-blue-600" : "border-gray-300"}`}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(null);
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
                        className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-blue-900 text-white" : "bg-white text-gray-800"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Hiển thị stock chỉ khi đã chọn size */}
              {selectedSize && (
                <p className={`text-sm mt-1 mb-3 ${currentStock > 0 ? "text-green-500" : "text-red-500"}`}>
                  {currentStock} in stock
                </p>
              )}
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

      {/* Mô tả chi tiết */}
      <div className="content-product w-[70%] mx-auto">
        <div
          className="font-sans text-[16px] text-[#01225a] mb-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
};

export default DeltaiProductAdmin;

