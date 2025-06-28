import React, { useState } from "react";

const FloatingInput = ({ label, name, value, onChange, type = "text", placeholder = "" }:any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full pt-5">
      <label
        className={`
          absolute left-2 text-gray-500 text-sm pointer-events-none transition-all duration-300
          ${isFocused || value
            ? "top-0 text-xs translate-y-[40%] opacity-100"
            : "top-1/2 translate-y-[-50%] opacity-0"}
        `}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 bg-transparent focus:outline-none p-2 placeholder-gray-400"
      />
    </div>
  );
};

const Checkout = () => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "Nguyễn Như Đức",
    phone: "0368437311",
    email: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    recipient: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  const products = [
    {
      id: 1,
      name: "Giày Vans Old Skool Classic",
      price: 1200000,
      originalPrice: 1500000,
      quantity: 1,
      image: "https://drake.vn/image/catalog/H%C3%ACnh%20content/hinh-anh-giay-vans/hinh-anh-giay-vans-17.jpg",
    },
    {
      id: 2,
      name: "Áo Hoodie Unisex Basic",
      price: 450000,
      originalPrice: 600000,
      quantity: 2,
      image: "https://drake.vn/image/catalog/H%C3%ACnh%20content/hinh-anh-giay-vans/hinh-anh-giay-vans-17.jpg",
    },
    {
      id: 3,
      name: "Balo Simple Carry K2",
      price: 850000,
      originalPrice: 990000,
      quantity: 1,
      image: "https://drake.vn/image/catalog/H%C3%ACnh%20content/hinh-anh-giay-vans/hinh-anh-giay-vans-17.jpg",
    },
  ];

  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCustomerChange = (e:any) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e:any) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-3xl mx-auto p-4 space-y-4 text-sm">
         <div className="flex">
          <div className="flex-1 text-center py-2 border-b-2 border-blue-950 font-semibold text-black">1. THÔNG TIN</div>
          <div className="flex-1 text-center py-2 border-b-2 border-gray-300 text-gray-500">2. THANH TOÁN</div>
        </div>
        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
          {products.map((product, index) => (
            <div key={product.id}>
              <div className="flex space-x-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 font-semibold">
                      {product.price.toLocaleString()}₫
                    </span>
                    <span className="line-through text-gray-400 text-xs">
                      {product.originalPrice.toLocaleString()}₫
                    </span>
                  </div>
                </div>
                <div className="text-right font-medium text-sm">x {product.quantity}</div>
              </div>
              {index !== products.length - 1 && <hr className="my-3 border-gray-200" />}
            </div>
          ))}
        </div>

        <h3 className="text-base font-medium text-gray-600">THÔNG TIN KHÁCH HÀNG</h3>
        <div className="p-4 rounded-xl space-y-4 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <FloatingInput
                label="Tên khách hàng"
                name="name"
                value={customerInfo.name}
                onChange={handleCustomerChange}
                placeholder="Tên khách hàng"
              />
              <FloatingInput
                label="Số điện thoại"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerChange}
                placeholder="Số điện thoại"
              />
            </div>
            <div className="space-y-3">
              <FloatingInput
                label="Email (nếu có)"
                name="email"
                value={customerInfo.email}
                onChange={handleCustomerChange}
                placeholder="Email (nếu có)"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">(*) Hóa đơn VAT sẽ được gửi qua email này</p>
        </div>

        <h3 className="text-base font-medium text-gray-600">THÔNG TIN NHẬN HÀNG</h3>
        <div className="p-4 rounded-xl space-y-4 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <FloatingInput
                label="Tên người nhận"
                name="recipient"
                value={shippingInfo.recipient}
                onChange={handleShippingChange}
                placeholder="Tên người nhận"
              />
              <FloatingInput
                label="Tỉnh / Thành phố"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingChange}
                placeholder="Tỉnh / Thành phố"
              />
              <FloatingInput
                label="Phường / Xã"
                name="ward"
                value={shippingInfo.ward}
                onChange={handleShippingChange}
                placeholder="Phường / Xã"
              />
              <FloatingInput
                label="Ghi chú khác (nếu có)"
                name="note"
                value={shippingInfo.note}
                onChange={handleShippingChange}
                placeholder="Ghi chú khác (nếu có)"
              />
            </div>
            <div className="space-y-3">
              <FloatingInput
                label="SĐT người nhận"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleShippingChange}
                placeholder="SĐT người nhận"
              />
              <FloatingInput
                label="Quận / Huyện"
                name="district"
                value={shippingInfo.district}
                onChange={handleShippingChange}
                placeholder="Quận / Huyện"
              />
              <FloatingInput
                label="Địa chỉ"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingChange}
                placeholder="Địa chỉ"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <span>Bạn có muốn xuất hóa đơn công ty không?</span>
          <label className="flex items-center space-x-1">
            <input type="radio" name="invoice" defaultChecked /> <span>Có</span>
          </label>
          <label className="flex items-center space-x-1">
            <input type="radio" name="invoice" /> <span>Không</span>
          </label>
        </div>

        <div className="flex justify-between font-semibold text-base pt-3">
          <h3 className="text-base font-medium text-gray-600">TỔNG TIỀN TẠM TÍNH:</h3>
          <span className="text-red-500">{total.toLocaleString()}₫</span>
        </div>

        <button className="w-full bg-blue-950 text-white py-2 rounded-xl text-base hover:bg-blue-900 mt-2">
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Checkout;
