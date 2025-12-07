import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
  const existingId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (existingId) return existingId;

  const newId = uuidv4();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, newId);

  return newId;
}

export async function resetDeviceId() {
  await SecureStore.deleteItemAsync(DEVICE_ID_KEY);
}
