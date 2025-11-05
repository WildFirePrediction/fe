import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, SelectionButton } from '../../components';

const WildFireMapScreen = () => {
  const [selectedRegion, setSelectedRegion] = useState('상도동');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = () => {};

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region);
  };

  const handleSetRegion = () => {};

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.container}>
        <BottomSheet style={style.bottomSheet} ref={bottomSheetRef} onChange={handleSheetChanges}>
          <BottomSheetView style={style.bottomSheetView}>
            <View style={style.bottomSheetRegionButtonsContainer}>
              <SelectionButton selected={selectedRegion === '상도동'} onClick={handleSelectRegion}>
                상도동
              </SelectionButton>
              <SelectionButton selected={selectedRegion === '흑석동'} onClick={handleSelectRegion}>
                흑석동
              </SelectionButton>
              <Button
                buttonType="setting"
                onClick={handleSetRegion}
                customStyle={style.bottomSheetRegionSettingButtonStyle}
              >
                지역 설정
              </Button>
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
});
