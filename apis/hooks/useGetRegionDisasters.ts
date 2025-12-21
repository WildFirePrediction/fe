import { getRegionDisasters } from '../disasterApi';
import { useQuery } from '@tanstack/react-query';

const useGetRegionDisasters = (regionId: number | undefined) => {
  return useQuery({
    queryKey: ['disasters', regionId],
    queryFn: () => getRegionDisasters(regionId!),
    select: data => data.result,
    enabled: regionId !== undefined,
  });
};
export default useGetRegionDisasters;
