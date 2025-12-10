import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon, WarningIcon } from '../../../assets/svgs/icons';
import { useEffect, useRef, useState } from 'react';
import theme from '../../../styles/theme';
import * as Location from 'expo-location';
import usePostRoutes from '../../../apis/hooks/usePostRoutes';
import { getBearing } from '../../../utils/mapUtil';
import { FullCoord } from '../../../types/locationCoord';
import { useDestination } from '../../../context/destinationContext';
import { firePredictionData } from '../../../mock/firePredictionData';
import { Bubble, FireAreaOverlay } from '../../../components';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const EvacuationRoute = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);
  const { destination } = useDestination();

  const [myLocation, setMyLocation] = useState<Camera | undefined>();
  const [route, setRoute] = useState<FullCoord[] | null>(null);
  const [prevRoute, setPrevRoute] = useState<FullCoord[] | null>(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showRoutePopup, setShowRoutePopup] = useState(false);

  const myLocationRef = useRef<Camera | undefined>(undefined);
  const routeRef = useRef<FullCoord[]>(null);
  const isFirstRoute = useRef(true);

  const postRoute = usePostRoutes();

  const handleGoBack = () => {
    router.back();
  };

  const setCurrentPosition = async () => {
    if (!destination) return;

    const position = await Location.getCurrentPositionAsync();
    const startLat = position.coords.latitude;
    const startLon = position.coords.longitude;
    const bearing = getBearing(position, destination);
    setMyLocation({
      latitude: startLat,
      longitude: startLon,
      zoom: 15,
      bearing: bearing,
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
    mapRef.current?.setLocationTrackingMode('Face');

    // 테스트용 코드 (경로 변경 상황)
    const timer = setTimeout(() => {
      if (myLocationRef.current) {
        postRoute.mutate(
          {
            startLat: myLocationRef.current.latitude,
            startLon: myLocationRef.current.longitude,
            endLat: 37.506038005044,
            endLon: 126.960421779226,
          },
          {
            onSuccess: response => {
              if (response.result) {
                setPrevRoute(routeRef.current);
                setShowRoutePopup(true);
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
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPosition();
  }, [destination]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (prevRoute) {
        setPrevRoute(null);
        setShowRoutePopup(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [prevRoute]);

  useEffect(() => {
    myLocationRef.current = myLocation;
  }, [myLocation]);

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  // 안내 팝업
  useEffect(() => {
    if (!route) return;
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    setShowAlert(true);

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [route]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.screen}>
        <View style={style.container}>
          <NaverMapView
            ref={mapRef}
            style={style.naverMap}
            camera={myLocation}
            isShowCompass={false}
            isShowLocationButton={false}
            locationOverlay={{ isVisible: true, anchor: { x: 0.5, y: 0.5 } }}
          >
            <FireAreaOverlay firePredictionData={firePredictionData} />
            {prevRoute && (
              <NaverMapPathOverlay
                coords={prevRoute}
                width={12}
                color={theme.color.rainBackground}
                outlineWidth={2}
                outlineColor={theme.color.white}
                zIndex={1}
              />
            )}
            {route && (
              <NaverMapPathOverlay
                coords={route}
                width={12}
                color={theme.color.rain}
                outlineWidth={2}
                outlineColor={theme.color.white}
                zIndex={10}
              />
            )}
            {myLocation && (
              <NaverMapMarkerOverlay
                latitude={myLocation.latitude}
                longitude={myLocation.longitude}
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
            {destination && route && showRoutePopup && (
              <NaverMapMarkerOverlay
                latitude={route.at(-20)!.latitude}
                longitude={route.at(-20)!.longitude}
              >
                <Bubble text="새 경로" />
              </NaverMapMarkerOverlay>
            )}
          </NaverMapView>
          <CancelIcon style={style.closeIcon} onPress={handleGoBack} />
          <View style={style.routeInfoContainer}>
            <Text style={style.routeInfoDistanceText}>{distance}m</Text>
            <View style={style.routeInfoLine} />
            <Text style={style.routeInfoTimeText}>{time}분</Text>
          </View>
          <View style={style.infoTextContainer}>
            <Text style={style.infoText}>
              산불 확산 예측에 따라 대피 이동 중 안전한 길로 우회하여 경로가 변경될 수 있습니다.
            </Text>
          </View>
          <Animatable.View animation={showAlert ? 'fadeIn' : 'fadeOut'} duration={500}>
            <LinearGradient
              style={style.alert}
              colors={[theme.color.darkGray3, theme.color.darkGray2]}
              start={{ x: 0.4, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={style.alertTextContainer}>
                <WarningIcon style={style.warningIcon} width={20} height={20} />
                <Text style={style.alertText}>경로가 변경되었습니다</Text>
              </View>
              <Text style={style.alertSubText}>안전한 길로 우회하여 안내합니다</Text>
            </LinearGradient>
          </Animatable.View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default EvacuationRoute;

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
  alert: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 15,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    borderColor: theme.color.darkGray1,
    borderWidth: 2,
    shadowColor: theme.color.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    bottom: 30,
    start: 20,
    end: 20,
  },
  alertTextContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  alertText: {
    fontSize: 20,
    color: theme.color.white,
    fontWeight: 'bold',
  },
  infoTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.darkGray1,
    shadowColor: theme.color.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    bottom: 30,
    start: 20,
    end: 20,
  },
  infoText: {
    fontSize: 14,
    color: theme.color.darkGray2,
    textAlign: 'center',
  },
  warningIcon: {
    color: theme.color.main,
    width: 15,
  },
  routeChangeText: {
    fontSize: 22,
  },
  alertSubText: {
    fontSize: 13,
    color: theme.color.lightGray1,
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
