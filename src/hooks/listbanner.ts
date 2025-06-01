import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useBannersAdmin = () => {
  return useQuery({
    queryKey: ['bannersAdmin'],
    queryFn: async () => {
      const res = await axios.get('/banners/admin/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, 
    retry: 1,
  });
};

export const useUpdateBannerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const token = localStorage.getItem("token") || "";
      const res = await axios.patch(
        `/banners/admin/${id}/visibility`,
        { is_active: isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
   onSuccess: () => {
  queryClient.invalidateQueries(["bannersAdmin"]); 
}

  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/banners/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannersAdmin'] });
    },
  });
};
  