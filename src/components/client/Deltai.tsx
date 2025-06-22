import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faShieldHalved  } from '@fortawesome/free-solid-svg-icons';
import { Image } from "antd";
const Deltai = () => {
  const products = [
    {
      id: 1,
      name: "NIKA – SKORTA S BLACK",
      price: 20.0,
      description: "Grum X Woman Sneaker",
      details:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.",
      stock: 20,
      sizes: [40, 41, 42, 43],
      images: {
        main: "/images/skarta-0.png",
        thumbs: [
          { src: "/images/skarta-0.png", active: true },
          { src: "/images/skarto-100x100.png", active: false },
        ],
        sku: "SKRTS",
        categories: "Casual",
        brand: "Nika",
      },
    },
  ];
  const relatedProducts = [
  {
    id: 1,
    name: "FILLO – XTREMA 3 RETRO",
    price: 20.0,
    image: "/images/giay1.png",
  },
  {
    id: 2,
    name: "NIKA – SKORTA S BLACK",
    price: 20.0,
    image: "/images/skarta-0.png",
  },
  {
    id: 3,
    name: "FILLO – YEZZO 2X WHITE",
    price: 20.0,
    image: "/images/giay2.png",
  },
  {
    id: 4,
    name: "FILLO – SUPRA R BLACK WHITE",
    price: 20.0,
    image: "/images/giay3.png",
  },
];


  const product = products[0];
  const [selectedImage, setSelectedImage] = useState(product.images.main);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center center" });
  const { sku, categories, brand } = product.images;
  // chat gpt
  const handleMouseMove = (e:any) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ transform: "scale(2)", transformOrigin: `${x}% ${y}%` });
  };
  
  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center center" });
  };
  const getDiscountPercent = (originalPrice: any, salePrice: any) => {
    const original = typeof originalPrice === 'object' && originalPrice?.$numberDecimal
    ? Number(originalPrice.$numberDecimal)
    : Number(originalPrice);

    const sale = typeof salePrice === 'object' && salePrice?.$numberDecimal
    ? Number(salePrice.$numberDecimal)
    : Number(salePrice);
    if (!original || original <= 0 || sale >= original) return 0;
    const discount = ((original - sale ) / original) * 100;
    return Math.round(discount); 
  }
  const discountPercent = getDiscountPercent(product.original_price, product.sale_price);
  return (
    <div className="w-full">
      <div className="w-full h-64 md:h-[250px] relative">
        <img
          src="/images/banerDeltai.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tto-transparent flex items-center justify-center">
          <h2 className="text-center text-xl md:text-2xl lg:text-[34px] font-bold text-white px-4">
            {product.name}
          </h2>
        </div>
      </div>
      <div className="max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<<<<<<< Updated upstream
          <div className="w-[100%] flex flex-col items-center">
            <div
              className="w-[100%] overflow-hidden relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image 
                className="w-[100%] h-[100%] object-cover transition-transform duration-200"
                src={selectedImage} 
                alt={product.name} 
                 preview={true}
              />
            </div>
            <div className="flex space-x-2 mt-4 justify-center md:justify-start">
              {product.images.thumbs.map((thumb, i) => (
=======
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
                      className="w-full h-full relative object-cover"
                      src={selectedImage}
                      alt={product.name}
                      preview={true}
                    />
                    <span className="max-w-16 block px-3 h-9 absolute top-2 right-2 text-center font-semibold leading-[36px] rounded bg-blue-950 text-white font-sans text-[15px]">-{discountPercent} %</span>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
            <div className="flex space-x-2 mt-4 justify-center md:justify-start flex-wrap">
              {filteredImages.map((img: string, i: number) => (
>>>>>>> Stashed changes
                <img
                  key={i}
                  src={thumb.src}
                  alt={`thumb-${i}`}
                  className={`w-14 h-14 sm:w-20 sm:h-20 object-cover cursor-pointer border ${
                    selectedImage === thumb.src ? "border-blue-600 opacity-100" : "border-gray-300 opacity-50"
                  }`}
                  onClick={() => setSelectedImage(thumb.src)}
                />
              ))}
            </div>
          </div>

          <div className="w-[100%] flex flex-col">
            <h1 className="text-lg md:text-[22px] font-bold text-[#01225a] mb-2">PRICE:</h1>
            <p className="text-2xl md:text-[32px] font-bold text-[#01225a] mb-3">
              ${product.price.toFixed(2)}
            </p>

            <div className="border-b border-gray-300 pb-0 mb-3 mt-[0px]"></div>
            <div className="content-product">
              <p className="font-bold font-sans text-[16px] text-[#01225a] mb-2">{product.description}</p>
              <p className="text-gray-500 mt-[20px] font-sans text-[12px] md:text-[14px]">{product.details}</p>
            </div>
            <div className="border-b border-gray-300 pb-5 mb-6"></div>
              <div className="pb-6 mb-0 flex flex-wrap gap-12">
                <span className="text-[14px] font-sans uppercase"><strong>SKU:</strong> {sku}</span>
                <span className="text-[14px] font-sans uppercase"><strong>Category:</strong> {categories}</span>
                <span className="text-[14px] font-sans uppercase"><strong>Brand:</strong> {brand}</span>
              </div>
            <div className="mb-6 bg-[#f7f7f7] p-4 rounded-[6px]">
            <div className="mb-6 bg-[#efefef] p-3.5 rounded transition-all duration-100 hover:bg-[#ebebeb]">
              <div className="flex flex-wrap items-center gap-2 mb-0">
                <span className="text-[#01225a] text-[15px] font-medium mr-2">Size:</span>
                {product.sizes.map((size) => (
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
              <p className="text-green-500 text-sm -mt-5">{product.stock} in stock</p>
            

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 mt-5">
              <input
                type="number"
                defaultValue={1}
                className="w-20 sm:w-16 border px-2 py-1 text-center border-[#01225a] outline-0"
              />
              <button className="bg-[#01225a] text-white text-[14px] cursor-pointer font-sans px-6 py-2 hover:bg-blue-900 rounded transition-all duration-300">
                ADD TO CART
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 ">
              <div className="flex items-center gap-1 text-[15px] [&_p]:text-[15px] [&_p]:font-sans [&_p]:font-bold [&_p]:text-[#01225a] [&_p]:ml-1.5">
                <FontAwesomeIcon className="text-[24px] text-[#01225a]" icon={faShieldHalved} /> <p>SAFETY INSURANCE</p>
              </div>
              <div className="flex items-center gap-1 [&_p]:text-[15px] [&_p]:font-sans [&_p]:font-bold [&_p]:text-[#01225a] [&_p]:ml-1.5">
                <FontAwesomeIcon className="text-[24px] text-[#01225a]" icon={faTruckFast} /> <p>FREE DELIVERY</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div className="max-w-[74%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-center text-[32px] tracking-wide font-bold text-[#01225a] mb-8">
        RELATED PRODUCTS
      </h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[26px]">
        {relatedProducts.map((item) => (
          <div key={item.id} className="list-product-one w-[100%] h-[340px] bg-[#ededed] flex flex-col items-center justify-center cursor-pointer group">
            <img src={item.image} alt={item.name} className="w-[180px] transition-all duration-300 group-hover:scale-[1.1]" />
            <div className='content w-[80%] pt-[10px]'>
              <h4 className="w-full text-[15px] font-bold font-sans text-black uppercase">{item.name}</h4>
              <p className="pt-[5px] font-sans font-semibold text-[#0b1f4e] text-[16px]">${item.price.toFixed(2)}</p>
            </div>
            <div className='pt-[10px] w-[80%]  mx-auto border-b-1 [&_p]:uppercase [&_p]:text-[13px] [&_p]:font-sans'>
              <p className='mt-[5px]'>Select options</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Deltai;