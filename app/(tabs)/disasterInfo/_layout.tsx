import { Stack } from 'expo-router';

export default function DisasterInfoLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
