import { Stack } from 'expo-router';

const MyPageLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};
export default MyPageLayout;
