import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Kiểu dữ liệu form banner
type BannerForm = {
  title: string;
  link?: string;
  position?: number;
  is_active?: boolean;
  image?: File; // Có thể không có nếu không cập nhật ảnh
};

type UseBannerParams = {
  resource: string;
};

// Thêm banner
export const useAddBanner = ({ resource }: UseBannerParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: BannerForm) => {
      const token = localStorage.getItem("token") || "";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("link", form.link || "");
      formData.append("position", String(form.position ?? 0));
      formData.append("is_active", String(form.is_active ?? true));
      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await axios.post(resource, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["banners"]);
    },
  });
};

// Cập nhật banner
export const useUpdateBanner = ({ resource }: UseBannerParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: BannerForm) => {
      const token = localStorage.getItem("token") || "";

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("link", form.link || "");
      formData.append("position", String(form.position ?? 0));
      formData.append("is_active", String(form.is_active ?? true));
      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await axios.put(resource, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["banners"]);
    },
  });
};

// Lấy chi tiết banner theo ID
export const useGetBannerById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["banner", id],
    queryFn: async () => {
      const res = await axios.get(`/banners/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};
