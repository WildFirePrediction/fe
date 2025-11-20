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
      <Stack.Screen name="shelters" options={{ headerShown: false }} />
      <Stack.Screen name="routePreview/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="route/[slug]" options={{ headerShown: false }} />
    </Stack>
  );
};
export default RootLayout;
