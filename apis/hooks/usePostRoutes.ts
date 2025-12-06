import { useMutation } from '@tanstack/react-query';
import { postRoutes } from '../routeApi';
import { PostRoutesParams } from '../types/route';

const usePostRoutes = () => {
  return useMutation({
    mutationFn: (params: PostRoutesParams) => postRoutes(params),
    onSuccess: response => {
      console.log(response.result);
    },
    onError: message => {
      console.error(message);
    },
  });
};
export default usePostRoutes;
