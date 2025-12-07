import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageKey } from '../constants/storageKey';

export async function getStorageItem<T>(key: AsyncStorageKey) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error('스토리지 아이템 파싱 실패', error);
    return null;
  }
}

export async function setStorageItem(key: AsyncStorageKey, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStorageItem(key: AsyncStorageKey) {
  await AsyncStorage.removeItem(key);
}
