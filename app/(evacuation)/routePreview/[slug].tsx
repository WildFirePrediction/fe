import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapPolygonOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon } from '../../../assets/svgs/icons';
import { Button } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import theme from '../../../styles/theme';
import { coordsFire, coordsFirePredict } from '../../../mock/fireAreaData';
import * as Location from 'expo-location';
import { getBearing } from '../../../utils/mapUtil';
import usePostRoutes from '../../../apis/hooks/usePostRoutes';
import { FullCoord } from '../../../types/locationCoord';
import { useDestination } from '../../../context/destinationContext';

const EvacuationRoutePreview = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mapRef = useRef<NaverMapViewRef>(null);

  const { destination } = useDestination();

  const [startLocation, setStartLocation] = useState<Camera | undefined>();
  const [route, setRoute] = useState<FullCoord[] | null>(null);

  const postRoute = usePostRoutes();

  const handleGoBack = () => {
    router.back();
  };

  const handleEvacuation = () => {
    router.replace(`/(evacuation)/route/${slug}`);
  };

  const setCurrentPosition = async () => {
    if (!destination) return;

    const position = await Location.getCurrentPositionAsync();

    const startLat = position.coords.latitude;
    const startLon = position.coords.longitude;
    const bearing = getBearing(position, destination);
    setStartLocation({
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
    mapRef.current?.setLocationTrackingMode('NoFollow');
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
                  text: destination.name,
                  requestedWidth: 30,
                }}
                image={require('../../../assets/pngs/arriveMarker.png')}
              />
            )}
          </NaverMapView>
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
  },
});
