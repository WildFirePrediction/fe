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
      <Stack.Screen name="shelters/index" options={{ headerShown: false }} />
      <Stack.Screen name="shelters/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="routePreview/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="route/[slug]" options={{ headerShown: false }} />
    </Stack>
  );
};
export default RootLayout;
