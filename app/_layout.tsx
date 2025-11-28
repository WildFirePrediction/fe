import { Stack } from 'expo-router';

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="regionSetting" options={{ headerShown: false }} />
      <Stack.Screen name="regionSearch" options={{ headerShown: false }} />
      <Stack.Screen name="(evacuation)" options={{ headerShown: false }} />
      <Stack.Screen name="disasterInfoMap" options={{ headerShown: false }} />
      <Stack.Screen name="disasterDetail/[slug]" options={{ headerShown: false }} />
    </Stack>
  );
};
export default RootLayout;
