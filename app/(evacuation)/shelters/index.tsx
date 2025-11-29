import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon, PeopleIcon, SortArrowDownIcon } from '../../../assets/svgs/icons';
import theme from '../../../styles/theme';
import { Button, MapButton } from '../../../components';
import { shelterData } from '../../../mock/shelterData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';

const sortOptions = ['거리순', '수용인원순'];

const Shelters = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mapRef = useRef<NaverMapViewRef>(null);
  const [sortType, setSortType] = useState('거리순');
  const [camera, setCamera] = useState<Camera>();
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const bottomSheetPosition = useSharedValue<number>(0);

  const floatingButtonsAnimatedStyle = useAnimatedStyle(() => ({
    top: bottomSheetPosition.value - 80,
  }));

  const handleSetSortOption = (option: string) => {
    setSortType(option);
    setSortModalOpen(false);
  };

  const handleEvacuationRoute = () => {
    router.push(`/(evacuation)/routePreview/${slug}`);
  };

  const handleShelterInfo = () => {
    router.push(`/(evacuation)/shelters/${slug}`);
  };

  const moveToCurrentLocation = async () => {
    try {
      const position = await Location.getCurrentPositionAsync();

      mapRef.current?.animateCameraTo({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 14,
      });
    } catch (error) {
      console.error('Cannot get location information:', error);
    }
  };

  useEffect(() => {
    if (shelterData.length > 0) {
      setCamera({ ...shelterData[0], zoom: 15 });
    }
    mapRef.current?.setLocationTrackingMode('NoFollow');
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={style.screen}>
        <View style={style.container}>
          <NaverMapView
            ref={mapRef}
            style={{ flex: 1 }}
            isShowLocationButton={false}
            camera={camera}
            isShowCompass={false}
            locationOverlay={{ isVisible: true, anchor: { x: 0.5, y: 0.5 } }}
          >
            {shelterData.map((shelter, index) => (
              <NaverMapMarkerOverlay
                key={`${shelter.name}-${index}`}
                latitude={shelter.latitude}
                longitude={shelter.longitude}
                caption={{
                  text: shelter.name,
                  requestedWidth: 40,
                }}
                image={require('../../../assets/pngs/shelterMarker.png')}
                onTap={handleEvacuationRoute}
              />
            ))}
          </NaverMapView>
          <CancelIcon style={style.closeIcon} onPress={() => router.back()} />

          <Modal visible={sortModalOpen} transparent={true} animationType="fade">
            <Pressable style={style.modalBackground} onPress={() => setSortModalOpen(false)}>
              <View style={style.modalContainer}>
                <Text style={style.modalTitle}>정렬 기준</Text>
                <View style={style.modalSortOptionsContainer}>
                  {sortOptions.map(option => (
                    <Pressable
                      key={option}
                      style={style.modalSortOptionItem}
                      onPress={() => handleSetSortOption(option)}
                    >
                      <Text
                        style={
                          option === sortType
                            ? style.modalSortOptionSelectedText
                            : style.modalSortOptionText
                        }
                      >
                        {option}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setSortModalOpen(false)}>
                  <Text style={style.modalCancelText}>취소</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
          <Animated.View style={[style.floatingButtonsContainer, floatingButtonsAnimatedStyle]}>
            <MapButton onClick={moveToCurrentLocation} />
          </Animated.View>
          <BottomSheet
            style={style.bottomSheet}
            snapPoints={[70, '40%']}
            index={1}
            overDragResistanceFactor={10}
            maxDynamicContentSize={700}
            animatedPosition={bottomSheetPosition}
          >
            <BottomSheetScrollView style={style.bottomSheetView}>
              <Pressable style={style.sortContainer} onPress={() => setSortModalOpen(true)}>
                <Text style={style.sortText}>{sortType}</Text>
                <SortArrowDownIcon style={style.sortArrowIconStyle} />
              </Pressable>
              <View style={style.bottomSheetListContainer}>
                {shelterData.map((shelter, index) => (
                  <Pressable
                    key={`${shelter.name}-${index}`}
                    style={
                      index === 0 && sortType === '거리순'
                        ? [style.listItemContainer, style.listItemHightlightContainer]
                        : style.listItemContainer
                    }
                    onPress={handleEvacuationRoute}
                  >
                    {index === 0 && sortType === '거리순' && (
                      <Text style={style.listItemHighlightText}>가장 가까운 대피소</Text>
                    )}
                    <View style={style.listItemDetailContainer}>
                      <View style={style.listItemTitleContainer}>
                        <Text style={style.listItemNameText} lineBreakStrategyIOS="hangul-word">
                          {shelter.name}
                        </Text>
                        <Text style={style.listItemAdressText}>{shelter.address}</Text>
                      </View>
                      <Text style={style.listItemTimeText}>{shelter.time}</Text>
                    </View>
                    <View style={style.listItemDetailContainer}>
                      <View style={style.listItemPeopleContainer}>
                        <PeopleIcon style={style.listItemPeopleIcon} />
                        <Text style={style.listItemPeopleText}>{shelter.people}명</Text>
                      </View>
                      <Button buttonType="action" colorStyle="white" onClick={handleShelterInfo}>
                        대피소 정보
                      </Button>
                    </View>
                  </Pressable>
                ))}
              </View>
            </BottomSheetScrollView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default Shelters;

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    marginStart: 20,
    marginTop: 20,
    color: theme.color.black,
  },
  bottomSheet: {
    flex: 1,
  },
  bottomSheetView: {
    display: 'flex',
    flexDirection: 'column',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    marginStart: 22,
  },
  sortText: {
    fontSize: 16,
  },
  sortArrowIconStyle: {
    color: theme.color.darkGray2,
    width: 13,
  },
  bottomSheetListContainer: {
    gap: 10,
    marginTop: 13,
  },
  listItemContainer: {
    gap: 7,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: theme.color.gray,
  },
  listItemDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemTitleContainer: {
    gap: 5,
  },
  listItemNameText: {
    fontSize: 17,
    width: 300,
  },
  listItemAdressText: {
    fontSize: 15,
    color: theme.color.darkGray1,
  },
  listItemTimeText: {
    fontSize: 17,
    color: theme.color.rain,
  },
  listItemPeopleContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  listItemPeopleText: {
    fontSize: 13,
    color: theme.color.darkGray2,
  },
  listItemPeopleIcon: {
    width: 18.5,
    color: theme.color.darkGray2,
  },
  listItemHightlightContainer: {
    backgroundColor: theme.color.lightGray1,
  },
  listItemHighlightText: {
    fontSize: 13,
    color: theme.color.main,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.color.white,
    borderRadius: 10,
    borderColor: theme.color.gray,
    borderWidth: 1,
    padding: 30,
    paddingBottom: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalSortOptionsContainer: {
    marginTop: 10,
    flexDirection: 'column',
  },
  modalSortOptionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.gray,
  },
  modalSortOptionText: {
    fontSize: 17,
    color: theme.color.black,
  },
  modalSortOptionSelectedText: {
    fontSize: 17,
    color: theme.color.main,
  },
  modalCancelText: {
    marginTop: 30,
    fontSize: 17,
    color: theme.color.darkGray1,
    alignSelf: 'flex-end',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    right: 10,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    gap: 20,
  },
});
