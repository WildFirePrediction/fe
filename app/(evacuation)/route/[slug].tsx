import {
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
import { evacuationRouteData } from '../../../mock/evacuationRouteData';
import theme from '../../../styles/theme';
import { coordsFire, coordsFirePredict } from '../../../mock/fireAreaData';
import * as Location from 'expo-location';

const EvacuationRoute = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);

  const [myLocation, setMyLocation] = useState({
    latitude: 37.505278,
    longitude: 126.954613,
    zoom: 15,
  });

  const handleGoBack = () => {
    router.back();
  };

  const setCurrentPosition = async () => {
    const position = await Location.getCurrentPositionAsync();
    setMyLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      zoom: 15,
    });
    console.log({ latitude: position.coords.latitude, longitude: position.coords.longitude });
  };

  useEffect(() => {
    const lat1 = myLocation.latitude;
    const lon1 = myLocation.longitude;

    const last = evacuationRouteData.at(-1) ?? { latitude: lat1, longitude: lon1 };
    const lat2 = last.latitude;
    const lon2 = last.longitude;

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;
    setMyLocation(prev => ({ ...prev, bearing: bearing }));
  }, [myLocation.latitude, myLocation.longitude]);

  useEffect(() => {
    mapRef.current?.setLocationTrackingMode('NoFollow');
    setCurrentPosition();
  }, []);

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
            <NaverMapPathOverlay
              coords={evacuationRouteData}
              width={12}
              color={theme.color.rain}
              outlineWidth={2}
              outlineColor={theme.color.white}
            />
            <NaverMapMarkerOverlay
              latitude={myLocation.latitude}
              longitude={myLocation.longitude}
              image={require('../../../assets/pngs/departureMarker.png')}
            />
            {evacuationRouteData.at(-1) !== undefined && (
              <NaverMapMarkerOverlay
                latitude={evacuationRouteData.at(-1)?.latitude ?? myLocation.latitude}
                longitude={evacuationRouteData.at(-1)?.longitude ?? myLocation.longitude}
                caption={{
                  text: '중앙대학교병원중앙관 지하주차장 1~3층 대피소',
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
