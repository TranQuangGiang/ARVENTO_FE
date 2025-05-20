import React, { useState } from "react";

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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ transform: "scale(2)", transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center center" });
  };

  return (
    <div className="w-full">
      <div className="w-full h-64 md:h-80 relative">
        <img
          src="/images/banerDeltai.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tto-transparent flex items-center justify-center">
          <h2 className="text-center text-xl md:text-3xl lg:text-5xl font-bold text-white px-4">
            {product.name}
          </h2>
        </div>
      </div>
     

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="flex flex-col items-center">
            <div
              className="w-full overflow-hidden relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto object-contain transition-transform duration-200"
                style={zoomStyle}
              />
            </div>
            <div className="flex space-x-2 mt-4 justify-center md:justify-start">
              {product.images.thumbs.map((thumb, i) => (
                <img
                  key={i}
                  src={thumb.src}
                  alt={`thumb-${i}`}
                  className={`w-16 h-16 sm:w-20 sm:h-20 object-cover cursor-pointer border ${
                    selectedImage === thumb.src ? "border-blue-600 opacity-100" : "border-gray-300 opacity-50"
                  }`}
                  onClick={() => setSelectedImage(thumb.src)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-bold text-blue-900 mb-2">PRICE:</h1>
            <p className="text-2xl md:text-4xl font-bold text-blue-900 mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="border-b border-gray-300 pb-0 mb-6"></div>
              <p className="font-semibold text-blue-900 mb-2">{product.description}</p>
              <p className="text-gray-500 text-sm md:text-base">{product.details}</p>
            
            <div className="border-b border-gray-300 pb-5 mb-6"></div>
              <div className="pb-6 mb-0 flex flex-wrap gap-12">
                <span className="text-sl"><strong>SKU:</strong> {sku}</span>
                <span className="text-sl"><strong>Category:</strong> {categories}</span>
                <span className="text-sl"><strong>Brand:</strong> {brand}</span>
              </div>

             <div className="mb-6 bg-gray-100 p-4 rounded">
            <div className="mb-6 bg-gray-200 p-4 rounded">
              <div className="flex flex-wrap items-center gap-2 mb-0">
                <span className="text-blue-900 font-medium mr-2">Size:</span>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
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
                className="w-20 sm:w-16 border px-2 py-1 text-center"
              />
              <button className="bg-blue-900 text-white px-6 py-2 hover:bg-blue-700 rounded">
                ADD TO CART
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 text-xl">
              <div className="flex items-center gap-1">
                <img src="/images/icon.png" width={30} alt="" /> SAFETY INSURANCE
              </div>
              <div className="flex items-center gap-1">
                <img src="/images/track.png" width={30} alt="" /> FREE DELIVERY
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h2 className="text-center text-3xl md:text-4xl font-bold text-blue-900 mb-8">
    RELATED PRODUCTS
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {relatedProducts.map((item) => (
      <div key={item.id} className=" bg-gray-200 rounded-lg p-4 flex flex-col shadow hover:shadow-lg transition">
        <img src={item.image} alt={item.name} className="w-full h-48 object-contain mb-4" />
         <h2 className="mt-4 text-lg font-semibold uppercase text-left">{item.name}</h2>
         <p className="text-blue-900 font-bold mb-2 text-xl">${item.price.toFixed(2)}</p>
        <a href="#" className="mt-2 inline-block text-sm uppercase underline underline-offset-4 text-gray-900">
          SELECT OPTIONS
        </a>
      </div>
    ))}
  </div>
</div>


  </div>
  );
};

export default Deltai;