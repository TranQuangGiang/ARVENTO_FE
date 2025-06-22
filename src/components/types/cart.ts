export type Product = {
    product_id: string | number;
    name: string;
    price: number;
    product_code: string;
}

export type Cart = {
  _id?: string | number;
  userId: string;
  product: string;
  product_id: string | number;
  selected_variant: {
    color: string;
    size: string;
    price: number;
    stock?: number;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
};


export type CartState = {
    carts: Cart[];
    cartItemCount: number;
}

export type CartAction = 
    | { type: "SET_CART"; payload: Cart[] }
    | { type: "ADD_TO_CART"; payload: Cart }
    | { type: "UPDATE_CART"; payload: Cart }
    | { type: "REMOVE_FROM_CART"; payload: Cart }
    | { type: "CLEAR_CART" }