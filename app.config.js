import 'dotenv/config';
if (!process.env.NAVER_CLIENT_ID) {
  throw new Error('NAVER_CLIENT_ID is not set');
}

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
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
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
          client_id: process.env.NAVER_CLIENT_ID,
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
          locationAlwaysPermission: '위치정보를 사용하도록 허용해주세요.',
          locationAlwaysAndWhenInUsePermission: '위치 정보를 사용하도록 허용해주세요.',
          locationWhenInUsePermission: '앱을 사용하는 동안 위치 정보를 사용하도록 허용해주세요.',
        },
      ],
    ],
  },
};
