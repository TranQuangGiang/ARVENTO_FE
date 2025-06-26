import type { Cart, CartAction, CartItem, CartState } from "../types/cart";

export const initialState: CartState = {
    cart: null,
    cartItemCount: 0,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "SET_CART": {
            const count = action.payload.items.reduce((acc, item) => acc + item.quantity, 0);
            return {
                ...state,
                cart: action.payload,
                cartItemCount: count,
            };
        }

        case "ADD_TO_CART": {
            if (!state.cart) return state;
            const existsIndex = state.cart.items.findIndex(
                (item) => 
                    item.product_id === action.payload.product_id &&
                    item.selected_variant.size === action.payload.selected_variant.size && 
                    item.selected_variant.color === action.payload.selected_variant.color
            );
            let updatedItems: CartItem[];
            
            if (existsIndex  !== -1) {
                updatedItems = [...state.cart.items];
                const existing = updatedItems[existsIndex];
                const newQuantity = existing.quantity + action.payload.quantity;
                updatedItems[existsIndex] = {
                    ...existing,
                    quantity: newQuantity,
                    total_price: newQuantity * existing.unit_price,
                };
            } else {
                updatedItems = [ ...state.cart.items, action.payload ];
            }
            const updatedCart: Cart = {
                ...state.cart,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
                subtotal: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
            }

            const count = updatedItems.reduce((acc, item) => acc + item.quantity, 0);

            return {
                cart: updatedCart,
                cartItemCount: count,
            }
        }

        case "UPDATE_CART": {
            if (!state.cart) return state;
            const updatedItems  = state.cart.items.map((item) => 
                item._id === action.payload._id ? action.payload : item
            );
            const updatedCart: Cart = {
                ...state.cart,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.total_price, 0 ),
                subtotal: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
            }
            const count = updatedItems.reduce((acc, item) => acc + item.quantity, 0);

            return {
                cart: updatedCart,
                cartItemCount: count,
            };
        }
        case "REMOVE_FROM_CART": {
            if (!state.cart) return state;

            const updatedItems = state.cart.items.filter(
                (item) => item._id !== action.payload
            );

            const updatedCart: Cart = {
                ...state.cart,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
                subtotal: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
            };

            const count = updatedItems.reduce((acc, item) => acc + item.quantity, 0);

            return {
                cart: updatedCart,
                cartItemCount: count,
            };
        }
         case "CLEAR_CART":
            return {
                ...state,
                cart: null,
                cartItemCount: 0,
            };
        default:
            return state;
    }   
}