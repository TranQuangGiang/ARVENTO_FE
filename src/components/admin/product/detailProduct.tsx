import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Image } from "antd";
import { useParams } from "react-router-dom";

import { motion, AnimatePresence } from 'framer-motion';
import { useOneData } from "../../../hooks/useOne";

const DeltaiProductAdmin = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  const { id } = useParams();
  const { data: productDetail } = useOneData({ resource: '/products', _id: id });
  const product = productDetail?.data;

  // Khi product load xong, chọn màu đầu tiên và ảnh đầu tiên tương ứng
  useEffect(() => {
    if (!product) return;

    // Giả sử product.variants có trường image, size, color, stock
    const variants = product.variants as Array<{
      color: string;
      size: number;
      image: string;
      stock: number;
    }>;

    // Lấy unique từng màu
    const colorVariants = [...new Map(variants.map((v) => [v.color, v])).values()];

    if (colorVariants.length > 0) {
      const firstColor = colorVariants[0].color;

      // Tìm ảnh đầu tiên của màu đó: nếu mỗi màu có 5 ảnh trong product.images
      const uniqueColors: string[] = Array.from(new Set(variants.map((v) => v.color)));
      const colorIndex = uniqueColors.indexOf(firstColor);
      const imagesPerColor = 5; // giả sử mỗi màu có 5 ảnh liên tiếp
      const startIndex = colorIndex * imagesPerColor;
      const firstImage = product.images?.[startIndex] || "";

      setSelectedColor(firstColor);
      setSelectedImage(firstImage);
      setSelectedSize(null);
    }
  }, [product]);

  if (!product) return <p className="text-center mt-10">Đang tải sản phẩm...</p>;

  // Lọc các biến thể theo màu đã chọn để lấy danh sách size
  const variants = product.variants || [];
  const sizes = variants
    .filter((v: any) => v.color === selectedColor)
    .map((v: any) => v.size);

  // Lọc 5 ảnh tương ứng với màu đã chọn
  const uniqueColors: string[] = Array.from(new Set(variants.map((v: any) => v.color)));
  const colorIndex = uniqueColors.indexOf(selectedColor);
  const imagesPerColor = 5;
  const startIndex = colorIndex * imagesPerColor;
  const filteredImages = product.images?.slice(startIndex, startIndex + imagesPerColor) || [];

  // Tồn kho: theo màu + size đã chọn
  const currentStock =
    variants.find((v: any) => v.size === selectedSize && v.color === selectedColor)?.stock ?? 0;

  // Hàm format giá
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
    <div className="w-[80%] mt-10 mx-auto bg-white rounded-[15px] shadow-md">
      {/* Nội dung chính */}
      <div className="max-w-[100%]  mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex space-x-2 mt-4 justify-center md:justify-start flex-wrap">
              {filteredImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`w-14 h-14 sm:w-20 sm:h-20 object-cover cursor-pointer border ${
                    selectedImage === img
                      ? "border-blue-600 opacity-100"
                      : "border-gray-300 opacity-50"
                  }`}
                  onClick={() => setSelectedImage(img)}
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
                {[...new Map(product.variants.map((v: any) => [v.color, v])).values()].map(
                  (variant: any, index: number) => {
                    const newColor = variant.color;
                    const newColorIndex = uniqueColors.indexOf(newColor);
                    // Ảnh đầu tiên của màu này:
                    const imagePerColor = 5;
                    const startIdx = newColorIndex * imagePerColor;
                    const firstImg = product.images?.[startIdx] || "";
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <img
                          src={firstImg}
                          alt={variant.color}
                          className={`w-[60px] h-[60px] rounded object-cover border ${
                            selectedColor === variant.color
                              ? "border-blue-600"
                              : "border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedColor(variant.color);
                            setSelectedImage(firstImg);
                            setSelectedSize(null);
                          }}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Chọn size */}
            <div className="mt-1 mb-6 bg-[#f7f7f7] p-4 rounded-[6px]">
              <div className="mb-6 bg-[#efefef] p-3.5 rounded transition-all duration-100 hover:bg-[#ebebeb]">
                <div className="flex flex-wrap items-center gap-2 mb-0">
                  <span className="text-[#01225a] text-[15px] font-medium mr-2">
                    Size:
                  </span>
                  {sizes.map((size: number) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded text-[14px] font-sans cursor-pointer ${
                        selectedSize === size
                          ? "bg-blue-900 text-white border-blue-900"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
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
                  defaultValue={1}
                  className="w-20 sm:w-16 border px-2 py-1 text-center border-[#01225a] outline-0"
                />
                <button
                  className="bg-[#01225a] text-white text-[14px] cursor-pointer font-sans px-6 py-2 hover:bg-blue-900 rounded transition-all duration-300"
                  disabled={selectedSize === null}
                >
                  ADD TO CART
                </button>
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

      {/* Mô tả chi tiết */}
      <div className="content-product max-w-[92%] mx-auto mb-8">
        <div
          className="font-sans text-[16px] text-[#01225a] mb-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
};

export default DeltaiProductAdmin;
