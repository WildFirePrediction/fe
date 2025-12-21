import { getDisasterInfoEarthquake } from '../disasterApi';
import { useQuery } from '@tanstack/react-query';

const useGetDisasterInfoEarthquake = () => {
  return useQuery({
    queryKey: ['earthquake-info'],
    queryFn: () => getDisasterInfoEarthquake(),
    select: data => data.result,
  });
};
export default useGetDisasterInfoEarthquake;
