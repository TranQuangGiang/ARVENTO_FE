import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useList } from "../../hooks/useList";
import AddAddressesClient from "./addAddresses";
import { Button, message, Spin } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

interface FloatingInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FloatingInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full pt-5">
      <label
        className={`
          absolute left-2 text-gray-500 text-sm pointer-events-none transition-all duration-300
          ${isFocused || value ? "top-0 text-xs translate-y-[40%] opacity-100" : "top-1/2 translate-y-[-50%] opacity-0"}
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
        disabled={disabled}
        className="w-full border-b border-gray-300 bg-transparent focus:outline-none p-2 placeholder-gray-400"
      />
    </div>
  );
};

const Checkout = () => {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const modalParam = searchParams.get("modal");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cart,
    discountAmount = 0,
    appliedCoupon = null,
  } = location.state || {};
  console.log(cart);
  
  
  const products = cart?.items || [];

  const { data: userData } = useList({ resource: "/users/me" });
  const { data: addressData, refetch: refetchAddresses } = useList({ resource: "/addresses/me" });

  const [defaultAddress, setDefaultAddress] = useState<any>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const fetchDefaultAddress = async () => {
    setLoadingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/addresses/me/default", {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      if (res.data?.success && res?.data) {
        setDefaultAddress(res.data.data);
      } else {
        setDefaultAddress(null);
      }
    } catch (err) {
      console.error("Lỗi fetch địa chỉ mặc định:", err);
      setDefaultAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchDefaultAddress();
  }, []);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
  const [shippingInfo, setShippingInfo] = useState({ id: "", recipient: "", fullAddress: "", note: "" });
  const [shippingFee, setShippingFee] = useState(0);

  const addresses: any = addressData?.data?.docs || [];
  const sortedAddresses = [...addresses].sort((a, b) => b.isDefault - a.isDefault);

  useEffect(() => {
    if (modalParam) setShowModal(modalParam);
  }, [modalParam]);

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setCustomerInfo(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (!loadingAddress) {
      if (!defaultAddress) {
        message.warning("Bạn chưa có địa chỉ mặc định. Vui lòng thêm địa chỉ.");
        setShippingInfo({ id: "", recipient: "", fullAddress: "", note: "" });
        setCustomerInfo(prev => ({ ...prev, phone: "" }));
        setShowModal("addAddress");
      } else {
        setShippingInfo(prev => ({
          ...prev,
          fullAddress: defaultAddress.fullAddress || "",
          note: defaultAddress.note || "",
          id: defaultAddress._id,
          recipient: defaultAddress.recipient || "",
        }));
        setCustomerInfo(prev => ({
          ...prev,
          phone: defaultAddress.phone || "",
        }));
        setShowModal(null);
      }
    }
  }, [defaultAddress, loadingAddress]);

  const calculateShippingFee = async (addr: any) => {
  try {
    const token = localStorage.getItem("token");
    const weight = products.reduce((acc: any, item: any) => acc + item.quantity * 500, 0);
    const toDistrictId = addr?.district_id;
    const toWardCode = addr?.ward_code;

    if (!toDistrictId || !toWardCode) {
      message.error("Địa chỉ giao hàng chưa đầy đủ!");
      return;
    }

    const serviceRes = await axios.get("http://localhost:3000/api/ghn/services", {
      params: { to_district_id: toDistrictId },
      headers: { Authorization: `Bearer ${token}` },
    });

    const serviceId = serviceRes.data?.data?.[0]?.service_id;
    if (!serviceId) {
      message.error("Không tìm thấy dịch vụ vận chuyển.");
      return;
    }

    const feeRes = await axios.post(
      "http://localhost:3000/api/ghn/fee",
      {
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        service_id: serviceId,
        weight,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const fee = feeRes.data?.data?.total || 0;
    setShippingFee(fee);
  } catch (error: any) {
    console.error("Lỗi tính phí GHN:", error?.response?.data || error);
    message.error("Không thể tính phí vận chuyển từ GHN.");
  }
};

  useEffect(() => {
  if (!loadingAddress && defaultAddress && products.length > 0) {
    calculateShippingFee(defaultAddress); 
  }
}, [defaultAddress, loadingAddress, products]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    if (!shippingInfo.recipient || !shippingInfo.fullAddress || !customerInfo.phone ) {
      message.error("Vui lòng nhập đúng số điện thoại và đầy đủ thông tin giao hàng!");
      return;
    }

    navigate("/thanhtoan", {
      state: {
        customerInfo,
        shippingInfo,
        cart,
        subtotal: cart?.subtotal || 0,
        discount: discountAmount,
        shippingFee,
        total: (cart?.subtotal || 0) - discountAmount + shippingFee,
        appliedCoupon,
      },
    });
  };
  
  return (
    <Spin spinning={loadingAddress} tip="Đang tải địa chỉ...">
      <div className="w-full bg-gray-100">
        <div className="max-w-3xl mx-auto p-4 space-y-4 text-sm">

          {/* Tiêu đề */}
          <div className="flex">
            <div className="flex-1 text-center py-2 border-b-2 border-blue-950 font-semibold text-black">
              1. THÔNG TIN
            </div>
            <div className="flex-1 text-center py-2 border-b-2 border-gray-300 text-gray-500">
              2. THANH TOÁN
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
            {products.map((product:any, index:any) => (
              <div key={product._id} className="flex space-x-3">
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
                    <p className="text-gray-600 text-xs">Màu: {product.selected_variant.color.name}</p>
                  )}
                  <p className="text-red-500 font-semibold">
                    {product.unit_price.toLocaleString()}₫
                  </p>
                </div>
                <div className="text-right font-medium text-sm">x {product.quantity}</div>
              </div>
            ))}
          </div>

          {/* Thông tin khách hàng */}
          <h3 className="text-base font-medium text-gray-600">THÔNG TIN KHÁCH HÀNG</h3>
          <div className="p-4 bg-white shadow-sm rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Tên khách hàng" name="name" value={customerInfo.name} onChange={handleCustomerChange} />
              <FloatingInput label="Email (nếu có)" name="email" value={customerInfo.email} onChange={handleCustomerChange} />
              <FloatingInput label="Số điện thoại" name="phone" value={customerInfo.phone} onChange={handleCustomerChange} />
            </div>
          </div>

          {/* Thông tin nhận hàng */}
          <h3 className="text-base font-medium text-gray-600">THÔNG TIN NHẬN HÀNG</h3>
          <div className="p-4 bg-white shadow-sm rounded-xl space-y-4">
            <FloatingInput label="Người nhận" placeholder="Người nhận hàng" name="recipient" value={shippingInfo.recipient} onChange={handleShippingChange} />
            <div className="relative">
              <FloatingInput
                label="Địa chỉ giao hàng mặc định"
                name="fullAddress"
                value={shippingInfo.fullAddress}
                onChange={handleShippingChange}
                placeholder="Địa chỉ giao hàng"
                disabled
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

                          // ✅ Gọi lại tính phí ship với chính địa chỉ được chọn
                          calculateShippingFee(addr);
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
                                await fetchDefaultAddress();
                                await refetchAddresses();
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

            <FloatingInput label="Ghi chú đơn hàng" name="note" placeholder="Ghi chú (nếu có)" value={shippingInfo.note} onChange={handleShippingChange} />
          </div>

          {/* Tổng */}
          <div className="w-full bg-white shadow-md rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{(cart?.subtotal || 0).toLocaleString()}₫</span>
            </div>
            {appliedCoupon && (
              <>
                <div className="flex justify-between">
                  <span>Mã giảm giá:</span>
                  <span className="text-green-600 font-semibold">{appliedCoupon.code}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span>-{discountAmount.toLocaleString()}₫</span>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString()}₫</span>
            </div>
           <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-red-500">
                {((cart?.subtotal || 0) - discountAmount + shippingFee).toLocaleString()}₫
              </span>
            </div>
          </div>

          <button
            className="w-full bg-blue-950 mt-6 mb-6 h-[40px] cursor-pointer text-white py-2 rounded hover:bg-blue-900"
            onClick={handleContinue}
          >
            Tiếp tục
          </button>
        </div>

        {/* Modal thêm địa chỉ */}
        <AddAddressesClient
          isOpen={showModal === "addAddress" }
          onClose={async () => {
            setShowModal(null);
            await fetchDefaultAddress();
            await refetchAddresses();
          }}
        />
      </div>
    </Spin>
  );
};

export default Checkout;