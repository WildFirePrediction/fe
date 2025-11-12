import 'dotenv/config';

export default {
  expo: {
    name: 'CAPSTONE25-FE',
    slug: 'CAPSTONE25-FE',
    version: '1.0.0',
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: 'capstone25fe',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.seoyeonyu.CAPSTONE25FE',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.seoyeonyu.CAPSTONE25FE',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'ddff9a63-1aeb-4f7f-bc6d-96d0f3863e57',
      },
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        '@mj-studio/react-native-naver-map',
        {
          client_id: process.env.NAVER_CLIENT_ID ?? '',
          android: {
            ACCESS_FINE_LOCATION: true,
            ACCESS_COARSE_LOCATION: true,
            ACCESS_BACKGROUND_LOCATION: true,
          },
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            extraMavenRepos: ['https://repository.map.naver.com/archive/maven'],
          },
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysPermission:
            'We use your location to see how far you are from spots, and also to show you your position in the map',
          locationAlwaysAndWhenInUsePermission: 'Allow WildfirePrediction to use your location.',
          locationWhenInUsePermission:
            'Allow WildfirePrediction to use your location while you are using the app.',
        },
      ],
    ],
  },
};
