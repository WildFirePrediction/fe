import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, MapButton, SelectionButton } from '../../components';
import * as Location from 'expo-location';
import {
  Camera,
  NaverMapPolygonOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import theme from '../../styles/theme';
import { AlertBellIcon, BubbleTail, DownArrowIcon, RainIcon } from '../../assets/svgs/icons';
import { coordsFire, coordsFirePredict } from '../../mock/fireAreaData';
import { myRegionData } from '../../mock/myRegionsData';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { disasterTextData } from '../../mock/disasterTextData';

const WildFireMapScreen = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);

  const [selectedRegion, setSelectedRegion] = useState(myRegionData.at(0));
  const [camera, setCamera] = useState<Camera | undefined>(myRegionData.at(0));
  const [isWeatherReportOpen, setIsWeatherReportOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState<Record<number, boolean>>({});
  const [isFireOccur, setIsFireOccur] = useState(true);
  const bottomSheetPosition = useSharedValue<number>(0);

  const floatingButtonsAnimatedStyle = useAnimatedStyle(() => ({
    top: bottomSheetPosition.value - 150,
  }));

  const handleSelectRegion = (regionName: string) => {
    const region = myRegionData.find(myRegion => myRegion.name === regionName);
    setSelectedRegion(region);
    setCamera(region ? { ...region, zoom: 13.5 } : region);
  };

  const handleSetRegion = () => {
    router.push('/regionSetting');
  };

  const handleNavigateToEvacuation = () => {
    router.push('/(evacuation)/shelters');
  };

  const handleToggleWeatherReport = () => {
    setIsWeatherReportOpen(prev => !prev);
  };

  const handleToggleMessage = (id: number) => {
    setIsMessageOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const moveToCurrentLocation = async () => {
    try {
      const position = await Location.getCurrentPositionAsync();

      mapRef.current?.animateCameraTo({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 13.5,
      });
    } catch (error) {
      console.error('Cannot get location information:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
          await Location.requestBackgroundPermissionsAsync();
          mapRef.current?.setLocationTrackingMode('NoFollow');
          setCamera(selectedRegion ? { ...selectedRegion, zoom: 13.5 } : selectedRegion);
        }
      } catch (e) {
        console.error(`Location request has been failed: ${e}`);
      }
    })();
  }, []);

  useEffect(() => {
    setIsMessageOpen(Object.fromEntries(disasterTextData.map(item => [item.id, false])));
  }, [disasterTextData]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.container}>
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1 }}
          camera={camera}
          isShowZoomControls={false}
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
        </NaverMapView>
        {isFireOccur && (
          <View style={style.alertPopup}>
            <AlertBellIcon style={style.alertPopupIcon} />
            <Text style={style.alertPopupText}>산불이 발생했습니다. 신속하게 대피하세요</Text>
          </View>
        )}
        <Animated.View style={[style.floatingButtonsContainer, floatingButtonsAnimatedStyle]}>
          <MapButton onClick={moveToCurrentLocation} />
          {isFireOccur && (
            <View style={style.navigationButtonContainer}>
              <View style={style.popupBubbleContainer}>
                <View style={style.popupBubble}>
                  <Text style={style.popupBubbleText}>산불 대피 안내를 시작하세요</Text>
                </View>
                <BubbleTail style={style.popupBubbleTail} />
              </View>
              <Button buttonType="floating" onClick={() => handleNavigateToEvacuation()}>
                대피 안내
              </Button>
            </View>
          )}
        </Animated.View>
        <BottomSheet
          style={style.bottomSheet}
          snapPoints={['10%', 200]}
          index={1}
          animatedPosition={bottomSheetPosition}
        >
          <BottomSheetView style={style.bottomSheetView}>
            <View style={style.bottomSheetRegionButtonsContainer}>
              {myRegionData.map(myRegion => (
                <SelectionButton
                  key={myRegion.name}
                  selected={selectedRegion?.name === myRegion.name}
                  onClick={handleSelectRegion}
                >
                  {myRegion.name}
                </SelectionButton>
              ))}
              <Button
                buttonType="setting"
                onClick={handleSetRegion}
                customStyle={style.bottomSheetRegionSettingButtonStyle}
              >
                지역 설정
              </Button>
            </View>
            <View style={style.bottomSheetBody}>
              <View style={style.bottomSheetSection}>
                <Text style={style.bottomSheetSectionLabel}>기상 특보</Text>
                <TouchableOpacity
                  style={style.bottomSheetWeatherReport}
                  onPress={handleToggleWeatherReport}
                  activeOpacity={1}
                >
                  <View style={style.bottomSheetWeatherReportTitle}>
                    <AlertBellIcon style={style.bottomSheetWeatherReportTitleIcon} />
                    <Text style={style.bottomSheetWeatherReportTitleText}>
                      <Text style={style.bottomSheetWeatherReportTitleHightlightText}>
                        건조주의보
                      </Text>{' '}
                      발효 중
                    </Text>
                    <DownArrowIcon style={style.bottomSheetWeatherReportArrowIcon} />
                  </View>
                  {isWeatherReportOpen && (
                    <View style={style.bottomSheetWeatherReportContent}>
                      <View style={style.bottomSheetWeatherReportTimeContainer}>
                        <Text style={style.bottomSheetWeatherReportTimeText}>
                          발표 2025.11.17 11:00
                        </Text>
                        <Text style={style.bottomSheetWeatherReportTimeText}>
                          발효 2025.11.17 11:00
                        </Text>
                      </View>

                      <Text style={style.bottomSheetWeatherReportRegions}>
                        강원 북부 산지, 강원중부산지, 강원 남부산지, 영덕, 울진평지, 포항,
                        경북북동산지
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View style={style.bottomSheetSection}>
                <Text style={style.bottomSheetSectionLabel}>재난 문자</Text>
                {disasterTextData.map((item, index) => (
                  <TouchableOpacity
                    key={`${item}-${index}`}
                    style={style.bottomSheetMessageContainer}
                    onPress={() => handleToggleMessage(item.id)}
                    activeOpacity={1}
                  >
                    <View style={style.bottomSheetWeatherReportTitle}>
                      <View
                        style={{
                          ...style.bottomSheetaMessageBadge,
                          backgroundColor: theme.color.rain,
                        }}
                      >
                        <RainIcon
                          width={18}
                          height={18}
                          style={style.bottomSheetMessageBadgeIcon}
                        />
                        <Text style={style.bottomSheetaMessageBadgeText}>호우</Text>
                      </View>
                      <Text style={style.bottomSheetMessageTitleText}>횡성</Text>
                      <DownArrowIcon style={style.bottomSheetWeatherReportArrowIcon} />
                    </View>
                    {isMessageOpen[item.id] && (
                      <>
                        <Text style={style.bottomSheetWeatherReportTimeText}>2025.11.22 22:55</Text>
                        <Text style={style.bottomSheetMessageText}>
                          오늘 16시 30분 호우주의보 발효. 개울가 하천 계곡 등 야영객은 안전한 장소로
                          대피하여 주시고 시설물 관리 및 안전사고에 유의하여 주시기 바랍니다{' '}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default WildFireMapScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  bottomSheet: {
    flex: 1,
  },
  bottomSheetView: {
    padding: 20,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  bottomSheetRegionButtonsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  bottomSheetRegionSettingButtonStyle: {
    marginLeft: 'auto',
  },
  bottomSheetInformationContainer: {
    height: 100,
    width: '100%',
    padding: 26,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: theme.color.gray,
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    gap: 30,
  },
  bottomSheetInformationIconStyle: {
    alignSelf: 'center',
  },
  bottomSheetInformationTextContainer: {
    display: 'flex',
  },
  bottomSheetInformationTitleStyle: {
    fontSize: 20,
  },
  bottomSheetInformationContentStyle: {
    fontSize: 16,
  },
  bottomSheetBody: {
    gap: 20,
  },
  bottomSheetSection: {
    gap: 10,
  },
  bottomSheetSectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSheetWeatherReport: {
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    backgroundColor: theme.color.lightGray1,
    borderColor: theme.color.gray,
    borderWidth: 1,
  },
  bottomSheetWeatherReportTitle: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    alignItems: 'center',
  },
  bottomSheetWeatherReportTitleIcon: {
    color: theme.color.main,
    width: 22,
  },
  bottomSheetWeatherReportTitleText: {
    fontSize: 18,
  },
  bottomSheetWeatherReportTitleHightlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.color.main,
  },
  bottomSheetWeatherReportArrowIcon: {
    marginLeft: 'auto',
  },
  bottomSheetWeatherReportContent: {
    flexDirection: 'row',
    gap: 30,
    width: '100%',
  },
  bottomSheetWeatherReportTimeContainer: {
    gap: 2,
  },
  bottomSheetWeatherReportTimeText: {
    fontSize: 12,
    color: theme.color.darkGray1,
  },
  bottomSheetWeatherReportRegions: {
    fontSize: 13,
    flexShrink: 1,
  },
  bottomSheetMessageContainer: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: theme.color.white,
    borderColor: theme.color.gray,
    borderWidth: 1,
  },
  bottomSheetMessageTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSheetaMessageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    gap: 3,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomSheetMessageBadgeIcon: {
    color: theme.color.white,
    width: 18,
  },
  bottomSheetaMessageBadgeText: {
    fontSize: 14,
    color: theme.color.white,
  },
  bottomSheetMessageText: {
    fontSize: 14,
  },

  floatingButtonsContainer: {
    position: 'absolute',
    right: 10,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  navigationButtonContainer: {
    marginTop: -20,
    alignItems: 'flex-end',
  },
  alertPopup: {
    position: 'absolute',
    top: 90,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.color.point,
    alignItems: 'center',
    shadowColor: theme.color.black,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 5,
  },
  alertPopupIcon: {
    color: theme.color.white,
    width: 22,
  },
  alertPopupText: {
    fontSize: 15,
    color: theme.color.white,
    fontWeight: 'bold',
  },
  popupBubbleContainer: {
    alignItems: 'flex-end',
    marginEnd: 60,
    shadowColor: theme.color.black,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 5,
  },
  popupBubble: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: theme.color.darkGray2,
  },
  popupBubbleText: {
    fontSize: 11,
    color: theme.color.white,
  },
  popupBubbleTail: {
    marginTop: -7,
    marginEnd: 20,
  },
});
