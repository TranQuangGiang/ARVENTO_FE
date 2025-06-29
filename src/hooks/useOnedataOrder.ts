import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type useOneDataParams = {
  resource: string;
  enabled?: boolean;
};

export const useOneDataOrder = ({ resource, enabled = true }: useOneDataParams) => {
  return useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const token = localStorage.getItem("token"); 
      const res = await axios.get(resource, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled,
  });
};
