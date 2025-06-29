import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

interface UpdateOptions {
  resource: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const useUpdate = ({ resource, onSuccess, onError }: UpdateOptions) => {
  const mutation = useMutation(
    async (params: { id: string; data: any; path?: string }) => {
      const { id, data, path } = params;
      const url = path ? path : `/${resource}/${id}`;
      const response = await axiosInstance.patch(url, data);
      return response.data;
    },
    {
      onSuccess,
      onError,
    }
  );

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isLoading,
  };
};
