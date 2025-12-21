import { useQuery } from '@tanstack/react-query';
import { getUserPreferences } from '../regionApi';

const useGetUserPreference = () => {
  return useQuery({
    queryKey: ['preference'],
    queryFn: () => getUserPreferences(),
    select: data => data.result,
  });
};

export default useGetUserPreference;
