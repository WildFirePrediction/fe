import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapPolygonOverlay,
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
import { coordsFire, coordsFirePredict } from '../../../mock/fireAreaData';
import * as Location from 'expo-location';
import usePostRoutes from '../../../apis/hooks/usePostRoutes';
import { getBearing } from '../../../utils/mapUtil';
import { FullCoord } from '../../../types/locationCoord';
import { useDestination } from '../../../context/destinationContext';

const EvacuationRoute = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);
  const { destination } = useDestination();

  // TODO: 로컬 스토리지의 내지역으로 초기화
  const [myLocation, setMyLocation] = useState<Camera | undefined>();
  const [route, setRoute] = useState<FullCoord[] | null>(null);

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
          if (response.result)
            setRoute(
              response.result.path.map(coord => ({
                latitude: coord[1],
                longitude: coord[0],
              })),
            );
        },
      },
    );
  };

  useEffect(() => {
    mapRef.current?.setLocationTrackingMode('Face');
    setCurrentPosition();
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
            camera={myLocation}
            isShowCompass={false}
            isShowLocationButton={false}
            locationOverlay={{ isVisible: true, anchor: { x: 0.5, y: 0.5 } }}
          >
            <NaverMapPolygonOverlay
              coords={coordsFire}
              color={theme.color.mainTransparent}
              outlineColor={theme.color.main}
              outlineWidth={1}
            />
            <NaverMapPolygonOverlay
              coords={coordsFirePredict}
              color={theme.color.mainTransparent}
              outlineColor={theme.color.main}
              outlineWidth={1}
            />
            {route && (
              <NaverMapPathOverlay
                coords={route}
                width={12}
                color={theme.color.rain}
                outlineWidth={2}
                outlineColor={theme.color.white}
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
                  text: destination.name,
                  requestedWidth: 30,
                }}
                image={require('../../../assets/pngs/arriveMarker.png')}
              />
            )}
          </NaverMapView>
          <CancelIcon style={style.closeIcon} onPress={handleGoBack} />
          <View style={style.infoContainer}>
            <View style={style.infoTextContainer}>
              <WarningIcon style={style.warningIcon} />
              <Text style={style.infoText}>산불 확산 예측에 따라 경로가 변경되었습니다</Text>
            </View>
            <Text style={style.routeChangeText}>중대병원 앞 경로 변경</Text>
            <Text style={style.infoSubText}>안전한 길로 우회하여 안내합니다</Text>
          </View>
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
  infoContainer: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 15,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    bottom: 30,
    start: 20,
    end: 20,
  },
  infoTextContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: theme.color.main,
  },
  warningIcon: {
    color: theme.color.main,
    width: 15,
  },
  routeChangeText: {
    fontSize: 22,
  },
  infoSubText: {
    fontSize: 13,
    color: theme.color.darkGray1,
  },
});
