import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapPolygonOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon } from '../../../assets/svgs/icons';
import { Button } from '../../../components';
import { useEffect, useState } from 'react';
import { evacuationRouteData } from '../../../mock/evacuationRouteData';
import theme from '../../../styles/theme';
import { coordsFire, coordsFirePredict } from '../../../mock/fireAreaData';

const EvacuationRoutePreview = () => {
  const router = useRouter();
  const id = useLocalSearchParams<{ slug: string }>();
  const [myLocation, setMyLocation] = useState({
    latitude: 37.505278,
    longitude: 126.954613,
    zoom: 15,
  });

  const handleGoBack = () => {
    router.back();
  };

  const handleEvacuation = () => {};

  useEffect(() => {
    const lat1 = myLocation.latitude;
    const lon1 = myLocation.longitude;

    const last = evacuationRouteData.at(-1) ?? { latitude: lat1, longitude: lon1 };
    const lat2 = last.latitude;
    const lon2 = last.longitude;

    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    let bearing = Math.atan2(y, x); // 라디안
    bearing = (bearing * 180) / Math.PI; // 도(deg)
    bearing = (bearing + 360) % 360; // 0~360 범위로 변환
    console.log(bearing);
    setMyLocation(prev => ({ ...prev, bearing: bearing }));
  }, [myLocation.latitude, myLocation.longitude]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.screen}>
        <View style={style.container}>
          <NaverMapView style={style.naverMap} camera={myLocation} isShowCompass={false}>
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
            <NaverMapPathOverlay coords={evacuationRouteData} width={12} color={theme.color.main} />
            <NaverMapMarkerOverlay
              latitude={myLocation.latitude}
              longitude={myLocation.longitude}
            />
            {evacuationRouteData.at(-1) !== undefined && (
              <NaverMapMarkerOverlay
                latitude={evacuationRouteData.at(-1)?.latitude ?? myLocation.latitude}
                longitude={evacuationRouteData.at(-1)?.longitude ?? myLocation.longitude}
                caption={{
                  text: '중앙대학교병원중앙관 지하주차장 1~3층 대피소',
                  requestedWidth: 30,
                }}
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
    color: theme.color.darkGray2,
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'column',
    gap: 25,
    bottom: 10,
    start: 20,
    end: 20,
  },
});
