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
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.seoyeonyu.CAPSTONE25FE',
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
    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-build-properties',
      [
        '@mj-studio/react-native-naver-map',
        {
          client_id: process.env.NAVER_CLIENT_ID ?? '',
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
          locationAlwaysAndWhenInUsePermission: 'Allow WildfirePrediction to use your location.',
          locationWhenInUsePermission:
            'Allow WildfirePrediction to use your location while you are using the app.',
        },
      ],
    ],
  },
};
