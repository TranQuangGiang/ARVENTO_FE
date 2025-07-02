import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/cartContexts";
import { useList } from "../../hooks/useList";

interface FloatingInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const FloatingInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: FloatingInputProps) => {
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
  const navigate = useNavigate();
  const { state: { cart } } = useCart();

  const { data: userData } = useList({
    resource: "/users/me",
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
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

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setCustomerInfo({
        name: user.name || "",
        phone: "",
        email: user.email || "",
      });
    }
  }, [userData]);

  const products = cart?.items || [];
  console.log(products);
  
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.applied_coupon?.discount_amount || 0;
  const total = cart ? cart.total : subtotal;

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    const { recipient, phone, city, district, ward, address } = shippingInfo;
    if (!recipient || !phone || !city || !district || !ward || !address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
      return;
    }

    navigate("/thanhtoan", {
      state: {
        customerInfo,
        shippingInfo,
        cart,
        subtotal,
        discount,
        total,
      },
    });
  };

  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-3xl mx-auto p-4 space-y-4 text-sm">
        <div className="flex">
          <div className="flex-1 text-center py-2 border-b-2 border-blue-950 font-semibold text-black">
            1. THÔNG TIN
          </div>
          <div className="flex-1 text-center py-2 border-b-2 border-gray-300 text-gray-500">
            2. THANH TOÁN
          </div>
        </div>

        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
          {products.map((product, index) => (
            <div key={product._id}>
              <div className="flex space-x-3">
                <img
                  src={product.selected_variant?.image?.url || "/no-image.png"}
                  alt={product.product?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.product?.name}</h3>
                  {product.selected_variant?.size && (
                    <p className="text-gray-600 text-xs">Size: {product.selected_variant.size}</p>
                  )}
                  {product.selected_variant?.color && (
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Màu: {product.selected_variant.color.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-red-500 font-semibold">
                      {product.unit_price.toLocaleString()}₫
                    </span>
                    {product?.unit_price && (
                      <span className="line-through text-gray-400 text-xs">
                        {product?.unit_price.toLocaleString()}₫
                      </span>
                    )}
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
        <div className="w-full min-h-[100px] rounded bg-white shadow-lg">
          <div className="flex justify-between font-semibold text-base pt-3 pl-3 pb-3 pr-3">
            <h3 className="text-[15px] font-sans font-medium text-gray-600">Tổng tiền tạm tính:</h3>
            <span className="text-red-500 font-sans">{subtotal.toLocaleString()}₫</span>
          </div>

          {cart?.applied_coupon && (
            <div className="flex justify-between font-semibold pt-1 text-green-600">
              <h3 className="text-[14px] font-sans">Giảm giá ({cart.applied_coupon.code}):</h3>
              <span>-{discount.toLocaleString()}₫</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-lg pt-1 pl-3 pr-3 pb-3">
            <h3 className="text-[18px] font-sans font-bold">Tổng cộng:</h3>
            <span className="text-red-500 font-sans text-[18px] font-bold">{total.toLocaleString()}₫</span>
          </div>
        </div>
        

        <button
          className="w-full bg-blue-950 mt-4 text-white py-2 rounded mb-8 text-base hover:bg-blue-900 cursor-pointer"
          onClick={handleContinue}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Checkout;