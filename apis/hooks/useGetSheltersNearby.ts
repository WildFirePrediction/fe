import { getSheltersNearby } from '../shelterApi';
import { useInfiniteQuery } from '@tanstack/react-query';

const useGetSheltersNearby = (lat: number | undefined, lon: number | undefined) => {
  return useInfiniteQuery({
    queryKey: ['getShelters', lat, lon],
    queryFn: ({ pageParam }) =>
      getSheltersNearby({ lat: lat as number, lon: lon as number, page: pageParam, size: 10 }),
    enabled: lat !== undefined && lon !== undefined,
    select: data => data.pages.map(page => page.result),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.result?.hasMore) {
        return lastPage.result.page + 1;
      } else {
        return null;
      }
    },
  });
};

export default useGetSheltersNearby;
