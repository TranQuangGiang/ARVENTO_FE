import { useQuery } from "@tanstack/react-query";
import { getList, getListClient } from "../providers/data/dataProviders";

type useListParams = {
  resource: string;
};

export const useListReview = ({ resource }: useListParams) => {
  return useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const res = await getList({ resource });
      return res.data.reviews || []; // ✅ Trả ra đúng mảng reviews
    }
  });
};

export const useListClient = ({ resource }: useListParams) => {
  return useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const res = await getListClient({ resource });
      return res.data.reviews || []; // ✅ Tương tự với phía client
    }
  });
};
