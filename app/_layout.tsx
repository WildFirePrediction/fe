import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { DestinationProvider } from '../context/destinationContext';
import { FirePredictionProvider } from '../context/firePredictionContext';
import { LocationProvider } from '../context/locationContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError: true,
    },
  },
});

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <FirePredictionProvider>
          <DestinationProvider>
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
          </DestinationProvider>
        </FirePredictionProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
};
export default RootLayout;
