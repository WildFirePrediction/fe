export const ASYNC_STORAGE_KEYS = {
  MY_REGIONS: 'my-regions',
};

export type AsyncStorageKey = (typeof ASYNC_STORAGE_KEYS)[keyof typeof ASYNC_STORAGE_KEYS];
