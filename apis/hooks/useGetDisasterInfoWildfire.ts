import { getDisasterInfoWildfire, getRegionDisasters } from '../disasterApi';
import { useQuery } from '@tanstack/react-query';

const useGetDisasterInfoWildfire = () => {
  return useQuery({
    queryKey: ['wildfire-info'],
    queryFn: () => getDisasterInfoWildfire(),
    select: data => data.result,
  });
};
export default useGetDisasterInfoWildfire;
