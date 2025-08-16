import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiClient from "../../hooks/refreshToken";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

type AuthContextType = {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
};

export const AuthContexts = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const nav = useNavigate();

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
        console.error(" Lỗi parse cookieUser:", error);
        Cookies.remove("user");
        Cookies.remove("token");
      }
    } else if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse storedUser:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userInfo: any) => {
    setUser(userInfo);

    const { user, access_token } = userInfo.data;
    console.log(userInfo.data);
    // Cookies
    Cookies.set("user", JSON.stringify(user), { expires: 7 });
    Cookies.set("token", access_token, { expires: 7 });
   

    // Local storage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", access_token);

    apiClient.defaults.headers.common["Authorization"] = "Bearer " + access_token;
    nav('/');
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      message.success("Đăng xuất thành công");
      
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      Cookies.remove("user");
      Cookies.remove("token");
      nav('/');
    }
  };


  return (
    <AuthContexts.Provider value={{ user, login, logout }}>
      {children}
    </AuthContexts.Provider>
  );
};
