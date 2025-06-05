  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import axios from "axios";

  type BannerForm = {
    title: string;
    link?: string;
    position?: number;
    is_active?: boolean;
    image: File;
  };

  type UseAddBannerParams = {
    resource: string;
  };

  export const useAddBanner = ({ resource }: UseAddBannerParams) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (form: BannerForm) => {
        const token = localStorage.getItem("token") || "";

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("link", form.link || "");
        formData.append("position", String(form.position ?? 0));
        formData.append("is_active", String(form.is_active ?? true));
        formData.append("image", form.image); 

        const res = await axios.post(resource, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        return res.data.data;
      },

      onSuccess: () => {
        queryClient.invalidateQueries({queryKey:["banners"]});
      },
    });
  };
