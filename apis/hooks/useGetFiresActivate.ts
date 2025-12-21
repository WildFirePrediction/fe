import { getFiresActivate } from '../fireApi';
import { useQuery } from '@tanstack/react-query';

const useGetFiresActivate = () => {
  return useQuery({
    queryKey: ['get-fire-activate'],
    queryFn: () => getFiresActivate(),
    select: data => data.result,
  });
};
export default useGetFiresActivate;
