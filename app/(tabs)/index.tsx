import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, SelectionButton } from '../../components';
import * as Location from 'expo-location';
import { Camera, NaverMapPolygonOverlay, NaverMapView } from '@mj-studio/react-native-naver-map';
import theme from '../../styles/theme';
import { RainIcon } from '../../assets/svgs/icons';
import { coordsFire, coordsFirePredict } from '../../mock/fireAreaData';
import { myRegionData } from '../../mock/myRegionsData';

const WildFireMapScreen = () => {
  const [selectedRegion, setSelectedRegion] = useState(myRegionData.at(0));
  const [camera, setCamera] = useState<Camera | undefined>(myRegionData.at(0));

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = () => {};

  const handleSelectRegion = (regionName: string) => {
    const region = myRegionData.find(myRegion => myRegion.name === regionName);
    setSelectedRegion(region);
    setCamera(region ? { ...region, zoom: 12 } : region);
  };

  const handleSetRegion = () => {};

  useEffect(() => {
    (async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (granted) {
          await Location.requestBackgroundPermissionsAsync();
        }
      } catch (e) {
        console.error(`Location request has been failed: ${e}`);
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.container}>
        <NaverMapView
          style={{ flex: 1 }}
          camera={camera}
          isShowLocationButton={true}
          locationOverlay={{
            isVisible: true,
          }}
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
        <BottomSheet
          style={style.bottomSheet}
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          enablePanDownToClose={true}
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
            <View style={style.bottomSheetInformationContainer}>
              <RainIcon style={style.bottomSheetInformationIconStyle} />
              <View style={style.bottomSheetInformationTextContainer}>
                <Text style={style.bottomSheetInformationTitleStyle}>호우 주의보</Text>
                <Text style={style.bottomSheetInformationContentStyle}>동작구 흑석동</Text>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
        <Button buttonType="floating" onClick={() => {}} customStyle={style.navigateButtonStyle}>
          대피 안내
        </Button>
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
  navigateButtonStyle: {
    position: 'absolute',
    bottom: 220,
    right: 10,
    alignSelf: 'flex-end',
  },
});
