import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../contexts/cartContexts";
import { useList } from "../../hooks/useList";
import AddAddressesClient from "./addAddresses";
import { Button, message, Spin } from "antd";
import { AnimatePresence, motion } from 'framer-motion';
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

interface FloatingInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const FloatingInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  readOnly = false,
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
  const [showModal, setShowModal] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const modalParam = searchParams.get("modal");
  useEffect(() => {
    if (modalParam) {
      setShowModal(modalParam);
    }
  }, [modalParam]);

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
    id: "",
    recipient: "",
    fullAddress: "",
    note: "",
  });

  useEffect(() => {
  if (userData?.data) {
    const user = userData.data;
    setCustomerInfo((prev) => ({
      ...prev,
      name: user.name || "",
      email: user.email || "",
    }));
  }
}, [userData])

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
    const { fullAddress } = shippingInfo;
    if (!fullAddress) {
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

  const { data:address, refetch:isReFetchDefault, isLoading } = useList({
    resource: `/addresses/me/default`,
  });

  const { data:addressData, refetch:isRefeatchAddres  } = useList({
    resource: `/addresses/me`
  });
  const addresses:any = addressData?.data?.docs || [];
  const sortedAddresses = [...addresses].sort((a, b) => b.isDefault - a.isDefault);
  console.log(addresses);
  console.log(sortedAddresses);
  
  useEffect(() => {
    if (!isLoading && !address?.data) {
      message.warning("Bạn chưa có địa chỉ mặc định. Vui lòng thêm địa chỉ.");
    }
  }, [address, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      if (addresses.length === 0) {
        // Không có địa chỉ mặc định
        setShippingInfo({
          id: "",
          recipient: "",
          fullAddress: "",
          note: "",
        });
        setCustomerInfo(prev => ({
          ...prev,
          phone: "",
        }));
        setShowModal("addAddress");
      } else {
        // Có địa chỉ mặc định
        setShippingInfo(prev => ({
          ...prev,
          fullAddress: address.data.fullAddress || "",
          note: address.data.note || "",
          id: address.data._id,
          recipient: address.data.recipient || "",
        }));
        setCustomerInfo(prev => ({
          ...prev,
          phone: address.data.phone || "",
        }));
        setShowModal(null);
      }
    }
  }, [address, isLoading, addresses]);

  
  return (
    <Spin spinning={isLoading} tip="Đang tải địa chỉ...">
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
        <div className="p-4 rounded-xl space-y-2 mb-2.5 bg-white shadow-sm">
          <FloatingInput
            label="Người nhận"
            name="recipient"
            value={shippingInfo.recipient}
            onChange={handleShippingChange}
            placeholder="Tên người nhận"
          />
          <div className="relative">
            <FloatingInput
              label="Địa chỉ giao hàng mặc định"
              name="fullAddress"
              value={shippingInfo.fullAddress}
              onChange={handleShippingChange}
              placeholder="Địa chỉ giao hàng"
              readOnly 
            />
            <Button
              type="link"
              className="!absolute top-5 right-0 text-blue-700 text-sm"
              icon={<PlusOutlined />}
              onClick={() => setShowModal("selectAddress")}
            >
              Chọn địa chỉ khác
            </Button>
          </div>
          {showModal === "selectAddress" && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 space-y-4"
                >
                  <h3 className="text-xl font-semibold text-center text-gray-800">
                    📍 Chọn địa chỉ giao hàng
                  </h3>

                  <div className="max-h-[600px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 pr-1">
                    {sortedAddresses.map((addr: any) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setShippingInfo((prev) => ({
                            ...prev,
                            fullAddress: addr.fullAddress,
                            note: addr.note || "",
                            id: addr._id,
                            recipient: addr.recipient || "",
                          }));
                          setCustomerInfo((prev) => ({
                            ...prev,
                            phone: addr.phone || "",
                          }));
                          setShowModal(null);
                        }}
                        className={`border-2 rounded-xl p-4 bg-blue-50 flex justify-between items-start gap-4 cursor-pointer transition-all duration-200 ${
                          shippingInfo.id === addr._id ? "border-blue-600" : "border-blue-200 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex-1  text-sm">
                          <div className="font-semibold text-black">{addr.label || addr.recipient}</div>
                          <div className="text-gray-700">{addr.fullAddress}</div>
                          <div className="text-gray-700">SĐT: {addr.phone}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {addr.isDefault ? (
                            <span className="text-blue-600 text-xs font-medium flex items-center">
                              <CheckOutlined className="mr-1" />
                              Địa chỉ mặc định
                            </span>
                          ) : (
                            <Button
                              size="small"
                              type="default"
                              className="text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600"
                              onClick={async () => {
                              try {
                                const token = localStorage.getItem("token");
                                await axios.patch(
                                  `http://localhost:3000/api/addresses/${addr._id}/set-default`,
                                  {},
                                  {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  }
                                );
                                message.success("Đã đặt làm địa chỉ mặc định", 1);
                                await isReFetchDefault();
                                await isRefeatchAddres();
                              } catch (error) {
                                message.error("Có lỗi xảy ra khi đặt mặc định");
                              }
                            }}
                          >
                            Đặt làm mặc định
                          </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button onClick={() => setShowModal(null)} className="bg-gray-200 hover:bg-gray-300">
                      Đóng
                    </Button>
                    <Button
                      type="primary"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setShowModal("addAddress")}
                    >
                      + Thêm địa chỉ
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}

          <FloatingInput
            label="Ghi chú đơn hàng (nếu có)"
            name="note"
            value={shippingInfo.note}
            onChange={handleShippingChange}
            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
          />
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
            <div className="flex justify-between font-semibold pl-3 pr-3 text-green-600">
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
      <AddAddressesClient 
        isOpen={showModal === "addAddress"} 
        onClose={async () => {
          setShowModal(null);
          await isReFetchDefault();
          await isRefeatchAddres();
      }}
      />
    </div>
    </Spin>
  );
};

export default Checkout;