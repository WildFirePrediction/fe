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
import { CancelIcon, SortArrowDownIcon } from '../../../assets/svgs/icons';
import theme from '../../../styles/theme';
import { Button, FireAreaOverlay, MapButton } from '../../../components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useDestination } from '../../../context/destinationContext';
import { FullCoord, FullCoordWithName } from '../../../types/locationCoord';
import useGetSheltersNearby from '../../../apis/hooks/useGetSheltersNearby';
import { ShelterData } from '../../../apis/types/shelter';
import { firePredictionData } from '../../../mock/firePredictionData';

const sortOptions = ['거리순', '수용인원순'];

const Shelters = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const mapRef = useRef<NaverMapViewRef>(null);
  const [sortType, setSortType] = useState('거리순');
  const [camera, setCamera] = useState<Camera>();
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const bottomSheetPosition = useSharedValue<number>(0);
  const [myLocation, setMyLocation] = useState<FullCoord | undefined>(undefined);

  const { setDestination } = useDestination();
  const {
    data: sheltersResponsePages,
    fetchNextPage,
    hasNextPage: hasMoreShelters,
  } = useGetSheltersNearby(myLocation?.latitude, myLocation?.longitude);
  const [shelters, setShelters] = useState<ShelterData[] | null>(null);

  const floatingButtonsAnimatedStyle = useAnimatedStyle(() => ({
    top: bottomSheetPosition.value - 80,
  }));

  const handleSetSortOption = (option: string) => {
    setSortType(option);
    setSortModalOpen(false);
  };

  const handleEvacuationRoute = (shelter: FullCoordWithName) => {
    setDestination(shelter);
    router.push(`/(evacuation)/routePreview/${slug}`);
  };

  const handleShowShelterMap = (shelter: FullCoordWithName) => {
    mapRef.current?.animateCameraTo({
      latitude: shelter.latitude,
      longitude: shelter.longitude,
      zoom: 15,
    });
  };

  const handleShelterInfo = () => {
    router.push(`/(evacuation)/shelters/${slug}`);
  };

  const handleMoreSearch = () => {
    if (hasMoreShelters) fetchNextPage();
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
    // shelters 데이터 set
    if (sheltersResponsePages !== undefined) {
      const resultShelters = sheltersResponsePages.flatMap(page => page?.shelters ?? []);
      setShelters(resultShelters);
      if (resultShelters.length > 0) {
        setCamera({
          ...resultShelters[0],
          zoom: 14,
        });
      }
    }
  }, [sheltersResponsePages]);

  useEffect(() => {
    mapRef.current?.setLocationTrackingMode('NoFollow');
    // 내위치 설정-> GET api 호출
    (async () => {
      const currentLocation = await Location.getCurrentPositionAsync();
      setMyLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
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
            <FireAreaOverlay />
            {shelters &&
              shelters.map((shelter, index) => (
                <NaverMapMarkerOverlay
                  key={`${shelter.facilityName}-${index}`}
                  latitude={shelter.latitude}
                  longitude={shelter.longitude}
                  caption={{
                    text: shelter.facilityName,
                    requestedWidth: 20,
                    haloColor: theme.color.white,
                    textSize: 11,
                  }}
                  image={require('../../../assets/pngs/shelterMarker.png')}
                  onTap={() => handleEvacuationRoute(shelter)}
                  isHideCollidedCaptions={true}
                />
              ))}
          </NaverMapView>
          <CancelIcon style={style.closeIcon} onPress={() => router.back()} />
          {hasMoreShelters && (
            <TouchableOpacity
              style={style.moreSearchButton}
              activeOpacity={0.7}
              onPress={handleMoreSearch}
            >
              <Text style={style.moreSearchText}>대피소 더보기</Text>
            </TouchableOpacity>
          )}
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
              <View style={style.bottomSheetOptionContainer}>
                <Pressable style={style.sortContainer} onPress={() => setSortModalOpen(true)}>
                  <Text style={style.sortText}>{sortType}</Text>
                  <SortArrowDownIcon style={style.sortArrowIconStyle} />
                </Pressable>
                <Text style={style.numberOfSheltersText}>주변 대피소 {shelters?.length}개</Text>
              </View>
              <View style={style.bottomSheetListContainer}>
                {shelters &&
                  shelters.map((shelter, index) => (
                    <Pressable
                      key={`${shelter.facilityName}-${index}`}
                      style={
                        index === 0 && sortType === '거리순'
                          ? [style.listItemContainer, style.listItemHightlightContainer]
                          : style.listItemContainer
                      }
                      onPress={() => handleShowShelterMap(shelter)}
                    >
                      {index === 0 && sortType === '거리순' && (
                        <Text style={style.listItemHighlightText}>가장 가까운 대피소</Text>
                      )}
                      <View style={style.listItemMainContainer}>
                        <View style={style.listItemTitleContainer}>
                          <Text style={style.listItemNameText} lineBreakStrategyIOS="hangul-word">
                            {shelter.facilityName}
                          </Text>
                          <Text style={style.listItemAdressText}>{shelter.roadAddress}</Text>
                        </View>
                        <Text style={style.listItemTimeText}>{shelter.distanceM}m</Text>
                      </View>
                      <View style={style.listItemDetailContainer}>
                        <Text style={style.listItemmTypeText}>{shelter.shelterTypeName}</Text>
                        <View style={style.listItemButtonContainer}>
                          <Button
                            buttonType="action"
                            colorStyle="white"
                            onClick={handleShelterInfo}
                            customStyle={{ alignSelf: 'auto' }}
                          >
                            대피소 정보
                          </Button>
                          <TouchableOpacity
                            style={style.listItemStartButton}
                            activeOpacity={0.5}
                            onPress={() => handleEvacuationRoute(shelter)}
                          >
                            <Text style={style.listItemStartButtonText}>안내 시작</Text>
                          </TouchableOpacity>
                        </View>
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
  bottomSheetOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  numberOfSheltersText: {
    fontSize: 16,
    color: theme.color.darkGray1,
    marginEnd: 20,
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
  listItemMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listItemDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  listItemTitleContainer: {
    gap: 5,
  },
  listItemNameText: {
    fontSize: 17,
    width: 300,
    fontWeight: '500',
  },
  listItemAdressText: {
    fontSize: 15,
    color: theme.color.darkGray1,
  },
  listItemTimeText: {
    fontSize: 17,
    color: theme.color.rain,
    fontWeight: '500',
  },
  listItemmTypeText: {
    fontSize: 13,
    color: theme.color.darkGray3,
  },
  listItemStartButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: theme.color.main,
  },
  listItemStartButtonText: {
    color: theme.color.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  listItemButtonContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
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
  moreSearchButton: {
    position: 'absolute',
    marginTop: 40,
    marginStart: 140,
    marginEnd: 140,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.color.gray,
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
  },
  moreSearchText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
