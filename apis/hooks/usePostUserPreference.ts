import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postUserPreferences } from '../regionApi';

const usePostUserPreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: number[]) => postUserPreferences(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['preference'],
      });
    },
  });
};

export default usePostUserPreference;
