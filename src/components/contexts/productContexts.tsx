import { createContext, useContext, useState } from "react";

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }:any) => {
    const [refresh, setRefresh] = useState(false);
    
    return (
        <ProductContext.Provider value={{ refresh, setRefresh }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProductContext = () => useContext(ProductContext);