export type Product = {
  product_id: string | number;
  name: string;
  price: number;
  product_code: string;
}

export type CartItem = {
  _id?: string | number;
  userId: string;
  product_id: string | number;
  selected_variant: {
    color: string;
    size: string;
    price: number;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: Product;
};

export type Cart = {
  _id?: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  applied_coupon?: {
    discount_amount: number;
    discount_type: 'percentage' | 'fixed';
  };
  created_at?: string;
  updated_at?: string;
};

export type CartState = {
  cart: Cart | null;
  cartItemCount: number;
}

export type CartAction = 
    | { type: "SET_CART"; payload: Cart }
    | { type: "ADD_TO_CART"; payload: CartItem }
    | { type: "UPDATE_CART"; payload: CartItem }
    | { type: "REMOVE_FROM_CART"; payload: string | number }
    | { type: "CLEAR_CART" }