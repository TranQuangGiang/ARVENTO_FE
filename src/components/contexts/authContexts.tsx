import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// import { refreshToken } from "../../providers/auth/dataProviders";


type AuthContextType = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
};

export const AuthContexts = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }:any ) => {
    const [ user, setUser ] = useState<any>(null);

    useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    const cookieToken = Cookies.get("token");
    const cookieUser = Cookies.get("user");

    if (!storedUser && cookieUser && cookieToken) {
        try {
            const parsedUser = JSON.parse(cookieUser);
            localStorage.setItem("user", cookieUser);
            localStorage.setItem("token", cookieToken);
            setUser(parsedUser);
        } catch (error) {
            console.error("❌ Lỗi parse cookieUser:", error);
            Cookies.remove("user");
            Cookies.remove("token");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const storedToken = localStorage.getItem("token");
            // đồng bộ lại 
            const cookieToken = Cookies.get("token");
            const cookieUser = Cookies.get("user");
            if (!storedUser && cookieUser && cookieToken) {
                localStorage.setItem("user", JSON.parse(cookieUser));
                localStorage.setItem("token", cookieToken);
                setUser(JSON.parse(cookieUser)); 
            } else if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
        }
    } else if (storedUser && storedToken) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error("❌ Lỗi parse storedUser:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
}, []);


    const login = (userInfo:any) => {
        setUser(userInfo);
        console.log(userInfo);

        {/* Cookies */}
        Cookies.set("user", JSON.stringify(userInfo.data.user), { expires: 7 });
        Cookies.set("token", userInfo.data.access_token, { expires: 7 });

        {/* local */}
        localStorage.setItem("user", JSON.stringify(userInfo.data.user))
        localStorage.setItem("token", userInfo.data.access_token)

    }

    const logout = () => {
        setUser(null);
        // xóa local
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        // xóa cookies
        Cookies.remove("user");
        Cookies.remove("token");   
    }
    return (
        <AuthContexts.Provider value={{user, login, logout}}>
            {children}
        </AuthContexts.Provider>
    )
}
