import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { Cart, CartItem, CartState } from "../types/cart";

import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";
import { cartReducer, initialState } from "../reducers/carReducers";

type CartContextType = {
    state: CartState;
    addToCart: (item: CartItem) => Promise<void>;
    updateCart: (product_id: string, size: string, color: { name: string, hex: string}, sku: string, price: number, image: { url: string, alt: string, id: string, _id: string } , stock: number, quantity: number) => Promise<void>;
    removeFromCart: (product_id: string, size: string, color: { name: string, hex: string }) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    applyVoucherToCart: (code: string) => Promise<any>;
    removeVoucherFromCart: () => Promise<void>;
    setSelectedVoucherCode: (code: string | null) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const prevTokenRef = useRef<string | null>(null);

    const getUserIdFromToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.id;
        } catch {
            return null;
        }
    };

    axios.defaults.baseURL = "http://localhost:3000/api";

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            if (!token) {
                dispatch({ type: "CLEAR_CART" });
                return;
            }
            const userId = getUserIdFromToken();
            if (!userId) return;
            const res = await axios.get(`/carts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const cartData: Cart = res.data.data;
            dispatch({ type: "SET_CART", payload: cartData });
            dispatch({ type: "SET_SELECTED_VOUCHER", payload: cartData.applied_coupon?.code || null });
        } catch (error) {
            console.error("Lỗi khi fetch cart:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem("token");
            if (prevTokenRef.current !== currentToken) {
                prevTokenRef.current = currentToken;
                fetchCart();
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetchCart();
    }, []);

    const addToCart = async (item: CartItem) => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.post("/carts/items", item, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: "ADD_TO_CART", payload: item });
            await fetchCart();
            message.success("Thêm sản phẩm vào giỏ hàng thành công");
        } catch (error: any) {
            const errorMsg =
                error?.response?.data?.message ||
                error?.message ||
                "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.";
            message.error(errorMsg);
        }
    };

    const updateCart = async (
        product_id: string,
        size: string,
        color: { name: string; hex: string },
        sku: string,
        price: number,
        image: { url: string, alt: string, id: string, _id: string },
        stock: number,
        quantity: number,
    ) => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.put(
                `/carts/items`,
                {
                    product_id,
                    selected_variant: { 
                        size, 
                        color,
                        sku,
                        price,
                        image,
                        stock, 
                    },
                    quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            await fetchCart();
            message.success("Cập nhật số lượng sản phẩm thành công");
        } catch (error) {
            console.error("Lỗi cập nhật cart:", error);
            message.error("Cập nhật thất bại");
        }
    };

    const removeFromCart = async (
        product_id: string,
        size: string,
        color: { name: string; hex: string }
    ) => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.request({
                method: "DELETE",
                url: "/carts/items",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                data: {
                    product_id,
                    selected_variant: { size, color },
                },
            });
            await fetchCart();
            message.success("Xoá sản phẩm khỏi giỏ hàng thành công");
        } catch (error) {
            console.error("Lỗi xoá sản phẩm:", error);
            message.error("Xoá sản phẩm thất bại");
        }
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.delete(`/carts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: "CLEAR_CART" });
            await fetchCart();
        } catch (error) {
            console.error("Lỗi xoá toàn bộ cart:", error);
        }
    };

    const applyVoucherToCart = async (code: string) => {
        try {
            const token = localStorage.getItem("token") || "";
            const res = await axios.post(
                "/carts/coupons",
                { coupon_code: code },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Lưu lại thông tin mã đã áp dụng vào context
            dispatch({ type: "SET_APPLIED_COUPON_DATA", payload: res.data.data });

            return res;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn";
            message.error(errorMessage);
            throw error;
        }
    };

    const removeVoucherFromCart = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.delete("/carts/coupons", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: "SET_APPLIED_COUPON_DATA", payload: null });
            await fetchCart();
            message.success("Xóa mã giảm giá thành công");
        } catch (error) {
            console.error("Lỗi khi xoá mã giảm giá:", error);
            message.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
        }
    };

    const setSelectedVoucherCode = (code: string | null) => {
        dispatch({ type: "SET_SELECTED_VOUCHER", payload: code });
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addToCart,
                updateCart,
                removeFromCart,
                clearCart,
                fetchCart,
                applyVoucherToCart,
                removeVoucherFromCart,
                setSelectedVoucherCode,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
};
