import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, FireAreaOverlay, MapButton, SelectionButton } from '../../components';
import * as Location from 'expo-location';
import { Camera, NaverMapView, NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import theme from '../../styles/theme';
import { AlertBellIcon, BubbleTail, DownArrowIcon, RainIcon } from '../../assets/svgs/icons';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useFirePrediction } from '../../context/firePredictionContext';
import useGetUserPreference from '../../apis/hooks/useGetUserPreference';
import { RegionResponse } from '../../apis/types/region';
import { useLocation } from '../../context/locationContext';
import useGetRegionDisasters from '../../apis/hooks/useGetRegionDisasters';

const WildFireMapScreen = () => {
  const router = useRouter();
  const mapRef = useRef<NaverMapViewRef>(null);

  const [selectedRegion, setSelectedRegion] = useState<RegionResponse | null>(null);
  const [camera, setCamera] = useState<Camera | undefined>(undefined);
  const [isWeatherReportOpen, setIsWeatherReportOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState<Record<number, boolean>>({});
  const [isFireOccur, setIsFireOccur] = useState(false);
  const [showFireAlert, setShowFireAlert] = useState(false);
  const bottomSheetPosition = useSharedValue<number>(0);

  const floatingButtonsAnimatedStyle = useAnimatedStyle(() => ({
    top: bottomSheetPosition.value - (isFireOccur ? 140 : 70),
  }));

  const { firePredictionDatas } = useFirePrediction();
  const { data: myRegionData } = useGetUserPreference();
  const { data: regionDisaster } = useGetRegionDisasters(selectedRegion?.id);

  const { currentLocation, setCurrentLocation } = useLocation();

  const handleSelectRegion = (region: RegionResponse) => {
    setSelectedRegion(region);
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
      // const position = await Location.getCurrentPositionAsync();

      // mapRef.current?.animateCameraTo({
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      //   zoom: 13.5,
      // });
      mapRef.current?.animateCameraTo({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        zoom: 13.5,
      });
    } catch (error) {
      console.error('Cannot get location information:', error);
    }
  };

  const moveToFire = () => {
    if (firePredictionDatas.length > 0) {
      mapRef.current?.animateCameraTo({
        latitude: firePredictionDatas[0].fire_location.lat,
        longitude: firePredictionDatas[0].fire_location.lon,
        zoom: 13.5,
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
          await Location.requestBackgroundPermissionsAsync();
          // mapRef.current?.setLocationTrackingMode('NoFollow');

          // const currentPosition = await Location.getCurrentPositionAsync();
          // setCamera({
          //   latitude: currentPosition.coords.latitude,
          //   longitude: currentPosition.coords.longitude,
          //   zoom: 13.5,
          // });
          setCamera({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            zoom: 13.5,
          });
        }
      } catch (e) {
        console.error(`Location request has been failed: ${e}`);
      }
    })();
  }, []);

  useEffect(() => {
    if (myRegionData && myRegionData.length > 0) {
      setSelectedRegion(myRegionData[0]);
    }
  }, [myRegionData]);

  useEffect(() => {
    if (regionDisaster)
      setIsMessageOpen(
        Object.fromEntries(regionDisaster?.emergencyMessages.map(item => [item.id, false])),
      );
  }, [regionDisaster]);

  useEffect(() => {
    if (firePredictionDatas.length > 0) {
      setIsFireOccur(true);
    }
    setShowFireAlert(true);
    const fireAlertTimer = setTimeout(() => {
      setShowFireAlert(false);
    }, 5000);
    return () => clearTimeout(fireAlertTimer);
  }, [firePredictionDatas]);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.container}>
        <NaverMapView
          ref={mapRef}
          style={{ flex: 1 }}
          camera={camera}
          isShowZoomControls={false}
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
          <FireAreaOverlay mapRef={mapRef} />
        </NaverMapView>
        {showFireAlert && (
          <View style={style.alertPopup}>
            <AlertBellIcon style={style.alertPopupIcon} />
            <Text style={style.alertPopupText}>산불이 발생했습니다. 발생 지역을 확인하세요</Text>
          </View>
        )}
        <Animated.View style={[style.floatingButtonsContainer, floatingButtonsAnimatedStyle]}>
          {/* {isFireOccur && (
            <MapButton type="fire" customStyle={style.fireMapButton} onClick={moveToFire} />
          )} */}
          <MapButton onClick={moveToCurrentLocation} />
          {/* {isFireOccur && (
            <View style={style.navigationButtonContainer}>
              <View style={style.popupBubbleContainer}>
                <View style={style.popupBubble}>
                  <Text style={style.popupBubbleText}>산불 대피 안내를 시작하세요</Text>
                </View>
                <BubbleTail style={style.popupBubbleTail} />
              </View>
            </View>
          )}{' '} */}
          {isFireOccur && (
            <Button buttonType="floating" onClick={() => handleNavigateToEvacuation()}>
              대피 안내
            </Button>
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
              {myRegionData &&
                myRegionData.map(myRegion => (
                  <SelectionButton
                    key={myRegion.eupmyeondong}
                    selected={selectedRegion?.eupmyeondong === myRegion.eupmyeondong}
                    onClick={() => handleSelectRegion(myRegion)}
                  >
                    {myRegion.eupmyeondong}
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
              {myRegionData && myRegionData.length > 0 && (
                <>
                  <View style={style.bottomSheetSection}>
                    <Text style={style.bottomSheetSectionLabel}>기상 특보</Text>
                    {regionDisaster && regionDisaster.weatherWarnings.length > 0 && (
                      <TouchableOpacity
                        style={style.bottomSheetWeatherReport}
                        onPress={handleToggleWeatherReport}
                        activeOpacity={1}
                      >
                        <View style={style.bottomSheetWeatherReportTitle}>
                          <AlertBellIcon style={style.bottomSheetWeatherReportTitleIcon} />
                          <Text style={style.bottomSheetWeatherReportTitleText}>
                            <Text style={style.bottomSheetWeatherReportTitleHightlightText}>
                              {regionDisaster.weatherWarnings[0].title}
                            </Text>
                          </Text>
                          <DownArrowIcon style={style.bottomSheetWeatherReportArrowIcon} />
                        </View>
                        {isWeatherReportOpen && (
                          <View style={style.bottomSheetWeatherReportContent}>
                            <View style={style.bottomSheetWeatherReportTimeContainer}>
                              <Text style={style.bottomSheetWeatherReportTimeText}>
                                발표 {regionDisaster.weatherWarnings[0].maasObtainedAtRaw}
                              </Text>
                              <Text style={style.bottomSheetWeatherReportTimeText}>
                                발효 {regionDisaster.weatherWarnings[0].effectiveStatusTimeRaw}
                              </Text>
                            </View>

                            <Text style={style.bottomSheetWeatherReportRegions}>
                              {regionDisaster.weatherWarnings[0].relevantZone}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                    {regionDisaster && regionDisaster.weatherWarnings.length === 0 && (
                      <View style={style.noDataContainer}>
                        <Text style={style.noDataText}>기상 특보가 없습니다</Text>
                      </View>
                    )}
                  </View>
                  <View style={style.bottomSheetSection}>
                    <Text style={style.bottomSheetSectionLabel}>재난 문자</Text>
                    {regionDisaster && regionDisaster.emergencyMessages.length > 0 ? (
                      regionDisaster.emergencyMessages.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          style={style.bottomSheetMessageContainer}
                          onPress={() => handleToggleMessage(item.id)}
                          activeOpacity={1}
                        >
                          <View style={style.bottomSheetWeatherReportTitle}>
                            {/* <View
                              style={{
                                ...style.bottomSheetMessageBadge,
                                backgroundColor: theme.color.rain,
                              }}
                            >
                              <RainIcon
                                width={18}
                                height={18}
                                style={style.bottomSheetMessageBadgeIcon}
                              />
                              <Text style={style.bottomSheetMessageBadgeText}>
                                {item.disasterTypeName}
                              </Text>
                            </View> */}
                            <Text style={style.bottomSheetMessageTitleText}>{item.regionName}</Text>
                            <DownArrowIcon style={style.bottomSheetWeatherReportArrowIcon} />
                          </View>
                          {isMessageOpen[item.id] && (
                            <>
                              <Text style={style.bottomSheetWeatherReportTimeText}>
                                {item.regDate}
                              </Text>
                              <Text style={style.bottomSheetMessageText}>
                                {item.messageContent}{' '}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={style.noDataContainer}>
                        <Text style={style.noDataText}>재난 문자가 없습니다</Text>
                      </View>
                    )}
                  </View>
                </>
              )}
              {myRegionData && myRegionData.length === 0 && (
                <View style={style.noDataContainer}>
                  <Text style={style.noDataText}>내 지역을 설정하고 재난 정보를 확인하세요!</Text>
                </View>
              )}
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
  bottomSheetMessageBadge: {
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
  bottomSheetMessageBadgeText: {
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
    gap: 10,
  },
  fireMapButton: {
    marginBottom: 10,
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
    backgroundColor: theme.color.fire,
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
    color: theme.color.darkGray2,
  },
  noDataContainer: {
    width: '100%',
    borderColor: theme.color.gray,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 15,
  },
});
