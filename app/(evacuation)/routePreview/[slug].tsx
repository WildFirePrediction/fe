import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon } from '../../../assets/svgs/icons';
import { Button, FireAreaOverlay } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import theme from '../../../styles/theme';
import * as Location from 'expo-location';
import usePostRoutes from '../../../apis/hooks/usePostRoutes';
import { FullCoord } from '../../../types/locationCoord';
import { useDestination } from '../../../context/destinationContext';
import { useLocation } from '../../../context/locationContext';

const EvacuationRoutePreview = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mapRef = useRef<NaverMapViewRef>(null);

  const { destination } = useDestination();
  const { currentLocation } = useLocation();

  const [startLocation, setStartLocation] = useState<Camera | undefined>();
  const [route, setRoute] = useState<FullCoord[] | null>(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  const postRoute = usePostRoutes();

  const handleGoBack = () => {
    router.back();
  };

  const handleEvacuation = () => {
    router.replace(`/(evacuation)/route/${slug}`);
  };

  const setCurrentPosition = async () => {
    if (!destination) return;

    // const position = await Location.getCurrentPositionAsync();

    // const startLat = position.coords.latitude;
    // const startLon = position.coords.longitude;
    const startLat = currentLocation.latitude;
    const startLon = currentLocation.longitude;
    setStartLocation({
      latitude: startLat,
      longitude: startLon,
      zoom: 14,
    });

    postRoute.mutate(
      {
        startLat: startLat,
        startLon: startLon,
        endLat: destination.latitude,
        endLon: destination.longitude,
      },
      {
        onSuccess: response => {
          if (response.result) {
            setDistance(response.result.totalDistance);
            setTime(response.result.totalTime);
            setRoute(
              response.result.path.map(coord => ({
                latitude: coord[1],
                longitude: coord[0],
              })),
            );
          }
        },
      },
    );
  };

  useEffect(() => {
    // mapRef.current?.setLocationTrackingMode('NoFollow');
  }, []);

  useEffect(() => {
    setCurrentPosition();
  }, [destination]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.screen}>
        <View style={style.container}>
          <NaverMapView
            ref={mapRef}
            style={style.naverMap}
            camera={startLocation}
            isShowCompass={false}
            isShowLocationButton={false}
            locationOverlay={{
              isVisible: true,
              anchor: { x: 0.5, y: 0.5 },
              position: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              },
            }}
          >
            <FireAreaOverlay />
            {route && (
              <NaverMapPathOverlay
                coords={route}
                width={12}
                color={theme.color.rain}
                outlineWidth={2}
                outlineColor={theme.color.white}
                globalZIndex={150000}
              />
            )}
            {startLocation && (
              <NaverMapMarkerOverlay
                latitude={startLocation.latitude}
                longitude={startLocation.longitude}
                image={require('../../../assets/pngs/departureMarker.png')}
              />
            )}
            {destination && (
              <NaverMapMarkerOverlay
                latitude={destination.latitude}
                longitude={destination.longitude}
                caption={{
                  text: destination.facilityName,
                  requestedWidth: 30,
                }}
                image={require('../../../assets/pngs/arriveMarker.png')}
              />
            )}
          </NaverMapView>
          <View style={style.routeInfoContainer}>
            <Text style={style.routeInfoDistanceText}>{distance}m</Text>
            <View style={style.routeInfoLine} />
            <Text style={style.routeInfoTimeText}>{time}분</Text>
          </View>
          <CancelIcon style={style.closeIcon} onPress={handleGoBack} />
          <View style={style.buttonContainer}>
            <Button buttonType="full" onClick={handleEvacuation}>
              이 경로로 안내
            </Button>
            <Button buttonType="full" colorStyle="white" onClick={handleGoBack}>
              다른 대피소 보기
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default EvacuationRoutePreview;

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  naverMap: {
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    marginStart: 20,
    marginTop: 20,
    color: theme.color.black,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 15,
    bottom: 20,
    start: 20,
    end: 20,
    shadowColor: theme.color.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  alertText: {
    fontSize: 20,
    color: theme.color.white,
    fontWeight: 'bold',
  },
  routeInfoContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: theme.color.gray,
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    marginTop: 20,
    marginEnd: 10,
  },
  routeInfoDistanceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeInfoLine: {
    backgroundColor: theme.color.gray,
    width: 1,
  },
  routeInfoTimeText: {
    fontSize: 16,
    color: theme.color.darkGray2,
  },
});
