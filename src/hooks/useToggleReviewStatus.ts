import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { message } from "antd";

export const useToggleReviewStatus = () => {
  return useMutation({
    mutationFn: async ({ reviewId }: { reviewId: string }) => {
      const token = localStorage.getItem("token"); // ✅ Đúng rồi

 // LẤY TẠI ĐÂY

      console.log("Token gửi:", token); // debug

      if (!token) {
        message.error("Bạn chưa đăng nhập hoặc token đã hết hạn");
        throw new Error("Token không tồn tại");
      }

      const res = await axiosInstance.put(
        `/reviews/admin/reviews/${reviewId}/hide`,
        {}, // không gửi body nếu backend không yêu cầu
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    },
  });
};

