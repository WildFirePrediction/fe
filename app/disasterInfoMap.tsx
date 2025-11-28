import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../styles/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  NaverMapMarkerOverlay,
  NaverMapView,
  NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useEffect, useRef, useState } from 'react';
import { BackArrowIcon } from '../assets/svgs/icons';
import { ScrollView } from 'react-native';
import { disasterCategories, disasterMap } from '../constants/categories';
import { myRegionData } from '../mock/myRegionsData';
import { MapButton, SelectionButton } from '../components';
import { Disaster } from '../types/disaster';
import { floodMapData } from '../mock/floodMapData';
import { router } from 'expo-router';
import * as Location from 'expo-location';

const DisasterInfoMap = () => {
  const mapRef = useRef<NaverMapViewRef>(null);
  const [camera, setCamera] = useState<Camera>();
  const [selectedCategory, setSelectedCategory] = useState<Disaster>('WILDFIRE');
  const [selectedRegion, setSelectedRegion] = useState(myRegionData.at(0));

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

  const handleDisasterDetail = () => {
    router.push('/disasterInfo/1');
  };

  useEffect(() => {
    if (floodMapData.length > 0) {
      setCamera({ ...floodMapData[0], zoom: 15 });
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
            {floodMapData.map((item, index) => (
              <NaverMapMarkerOverlay
                key={`${item.latitude}-${index}`}
                latitude={item.latitude}
                longitude={item.longitude}
                image={require('../assets/pngs/floodMarker.png')}
                caption={{ text: item.date, align: 'Top' }}
                onTap={() => handleDisasterDetail()}
              />
            ))}
          </NaverMapView>
          <View style={style.headerContainer}>
            <View style={style.header}>
              <TouchableOpacity style={style.backButton} onPress={() => router.back()}>
                <BackArrowIcon />
              </TouchableOpacity>
              <Text style={style.headerText}>재난 지도</Text>
            </View>
            <View style={style.regionSelectionContainer}>
              <ScrollView horizontal={true} bounces={false}>
                <View style={style.regionSelectionListContainer}>
                  {myRegionData.map((region, index) => (
                    <SelectionButton
                      key={`${region}-${index}`}
                      selected={region.name === selectedRegion?.name}
                      onClick={() => setSelectedRegion(region)}
                    >
                      {region.name}
                    </SelectionButton>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={style.categoryContainer}>
              {disasterCategories.map((category, index) => (
                <TouchableOpacity
                  key={`${category}-${index}`}
                  style={
                    disasterMap[category] === selectedCategory
                      ? [style.categoryButton, style.selectedCategoryButton]
                      : style.categoryButton
                  }
                  onPress={() => setSelectedCategory(disasterMap[category])}
                >
                  <Text
                    style={
                      disasterMap[category] === selectedCategory
                        ? style.selectedCategoryButtonText
                        : style.categoryButtonText
                    }
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <MapButton customStyle={style.mapButton} onClick={moveToCurrentLocation} />
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
export default DisasterInfoMap;

const style = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    height: '100%',
  },
  header: {
    width: '100%',
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
  },
  backButton: {
    marginEnd: 'auto',
  },
  headerText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
  },
  regionSelectionContainer: {
    width: '100%',
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 0,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 4,
      height: 4,
    },
  },
  regionSelectionListContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 15,
    marginStart: 20,
    marginTop: 13,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    borderWidth: 1,
    borderColor: theme.color.gray,
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 4,
      height: 4,
    },
  },
  selectedCategoryButton: {
    backgroundColor: theme.color.main,
    borderColor: theme.color.main,
  },
  categoryButtonText: {
    fontSize: 14,
    color: theme.color.darkGray2,
  },
  selectedCategoryButtonText: {
    fontSize: 14,
    color: theme.color.white,
    fontWeight: 'bold',
  },
  mapButton: {
    marginTop: 'auto',
    marginBottom: 70,
    marginEnd: 20,
    alignSelf: 'flex-end',
  },
});
