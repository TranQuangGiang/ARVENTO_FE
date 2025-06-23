import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { Cart, CartItem, CartState } from "../types/cart"
import { cartReducer, initialState } from "../reducers/cartReducers";
import axios from "axios";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

type CartContextType = {
    state: CartState;
    addToCart: (item: CartItem) => Promise<void>;
    updateCart: (product_id: string, size: string, color: string, quantity: number) => Promise<void>;
    removeFromCart: (product_id: string, size: string, color: string) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: {children: React.ReactNode}) => {
    const [state, dispatch ] = useReducer(cartReducer, initialState);
    const prevTokenRef = useRef<string | null>(null);
    const getUserIdFromToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) return null;
            try {
                const decoded: any = jwtDecode(token);
                console.log(decoded);
                return decoded.id; // hoặc decoded._id nếu BE dùng _id
            } catch {
                return null;
        }
    };


    axios.defaults.baseURL = "http://localhost:3000/api";

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token") || "";
            const userId = getUserIdFromToken();
            if (!userId) return;
            const res = await axios.get(`/carts?user=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const cartData: Cart = res.data.data;
            dispatch({ type: "SET_CART", payload: cartData });
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
        }, 1000);
        return () => clearInterval(interval)
    }, []);
    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (item: CartItem) => {
        try {
            const token = localStorage.getItem("token") || "";
            await axios.post("/carts/items", item, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch({ type: "ADD_TO_CART", payload: item });
            await fetchCart();
            message.success("Add product to cart successfully")
        } catch (error) {
            console.error("Lỗi thêm vào cart:", error);
        }
    }

    const updateCart = async (
        product_id: string,
        size: string,
        color: string,
        quantity: number
        ) => {
        try {
            const token = localStorage.getItem("token") || "";

            await axios.put(
                `/carts/items`,
                {
                    product_id,
                    selected_variant: { size, color },
                    quantity,
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Không cần dispatch tạm thời, vì bạn đã fetchCart ngay sau đó
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
        color: string
        ) => {
        try {
            const token = localStorage.getItem("token") || "";

            await axios.request({
                method: "DELETE",
                url: "/carts/items",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Rất quan trọng
                },
                data: {
                    product_id,
                    selected_variant: {
                        size,
                        color,
                    },
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
            await axios.delete(`/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            dispatch({ type: "CLEAR_CART" });
            await fetchCart();
        } catch (error) {
            console.error("Lỗi xoá toàn bộ cart:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{state, addToCart, updateCart, removeFromCart, clearCart, fetchCart}}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
}