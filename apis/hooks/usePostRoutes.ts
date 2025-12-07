import { useMutation } from '@tanstack/react-query';
import { postRoutes } from '../routeApi';
import { PostRoutesParams } from '../types/route';

const usePostRoutes = () => {
  return useMutation({
    mutationFn: (params: PostRoutesParams) => postRoutes(params),
    onError: (error: Error) => {
      console.error(error);
    },
  });
};
export default usePostRoutes;
