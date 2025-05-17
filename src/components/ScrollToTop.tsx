import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi lần pathname (route) thay đổi, cuộn lên đầu
    window.scrollTo({
      top: 0,
      behavior: "auto", // hoặc "smooth" nếu muốn hiệu ứng mượt
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
