import { useQuery } from '@tanstack/react-query';
import { getRegionsSearch } from '../regionApi';

const useGetRegionSearch = (keyword: string) => {
  return useQuery({
    queryKey: ['region-search', keyword],
    queryFn: () => getRegionsSearch({ keyword }),
    select: data => data.result,
  });
};

export default useGetRegionSearch;
