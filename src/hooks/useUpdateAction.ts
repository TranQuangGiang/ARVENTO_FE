import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { message } from "antd";

export const useApproveReview = () => {
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Bạn chưa đăng nhập hoặc token đã hết hạn");
        throw new Error("Token không tồn tại");
      }

      const res = await axiosInstance.put(
        `/reviews/admin/reviews/${reviewId}/approve`,
        {},
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
