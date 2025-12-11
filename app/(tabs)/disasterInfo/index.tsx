import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../../styles/theme';
import {
  DustIcon,
  EarthquakeIcon,
  FloodIcon,
  LandSlideIcon,
  MapIcon,
  SnowIcon,
  WildFireIcon,
} from '../../../assets/svgs/icons';
import { Button, SelectionButton } from '../../../components';
import { disasterInfoData } from '../../../mock/disasterInfoData';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { disastersKor, disasterMap } from '../../../constants/categories';
import { Disaster } from '../../../types/disaster';
import { SvgProps } from 'react-native-svg';
import useGetUserPreference from '../../../apis/hooks/useGetUserPreference';
import { RegionResponse } from '../../../apis/types/region';
import useGetDisasterInfoWildfire from '../../../apis/hooks/useGetDisasterInfoWildfire';
import useGetDisasterInfoEarthquake from '../../../apis/hooks/useGetDisasterInfoEarthquake';

const iconMap: Record<Disaster, React.FC<SvgProps>> = {
  WILDFIRE: WildFireIcon,
  LANDSLIDE: LandSlideIcon,
  FLOOD: FloodIcon,
  SNOW: SnowIcon,
  DUST: DustIcon,
  EARTHQUAKE: EarthquakeIcon,
};

const DisasterInfoScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Disaster>('WILDFIRE');

  const { data: wildFireData } = useGetDisasterInfoWildfire();
  const { data: earthquakeData } = useGetDisasterInfoEarthquake();

  const renderIcon = (item: Disaster) => {
    const IconComponent = iconMap[item];
    return (
      <IconComponent
        style={item === selectedCategory ? style.selectedCategoryIcon : style.categoryIcon}
      />
    );
  };

  const handleShowMap = () => {
    router.push('/disasterInfoMap');
  };

  return (
    <SafeAreaView style={style.container} edges={['top', 'left', 'right']}>
      <ScrollView style={style.scrollview} bounces={false}>
        <View style={style.header}>
          <Text style={style.headerText}>재난정보</Text>
          <TouchableOpacity style={style.mapButton} onPress={() => handleShowMap()}>
            <MapIcon />
            <Text style={style.mapButtonText}>지도 보기</Text>
          </TouchableOpacity>
        </View>
        <View style={style.categoryContainer}>
          <FlatList
            data={disastersKor}
            columnWrapperStyle={style.columnWrapperStyle}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={style.categoryItem}
                onPress={() => setSelectedCategory(disasterMap[item])}
                activeOpacity={1}
              >
                <>
                  {renderIcon(disasterMap[item])}
                  <Text
                    style={
                      disasterMap[item] === selectedCategory
                        ? style.selectedCategoryStyle
                        : style.categoryLabel
                    }
                  >
                    {item}
                  </Text>
                </>
              </TouchableOpacity>
            )}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={item => item}
          />
        </View>
        <View style={style.body}>
          <View style={style.resultListContainer}>
            {selectedCategory === 'WILDFIRE' &&
              wildFireData?.wildfires.map(item => (
                <TouchableOpacity key={`${item.id}`} style={style.resultListItem} activeOpacity={1}>
                  <Text style={style.resultItemDateText}>
                    {item.ignitionDateTime.substring(0, 16)}
                  </Text>
                  <Text style={style.resultItemText}>{item.address}</Text>
                </TouchableOpacity>
              ))}
            {selectedCategory === 'EARTHQUAKE' &&
              earthquakeData?.earthquakes.map(item => (
                <TouchableOpacity key={`${item.id}`} style={style.resultListItem} activeOpacity={1}>
                  <Text style={style.resultItemDateText}>
                    {item.occurrenceTime.substring(0, 16)}
                  </Text>
                  <Text style={style.resultItemText}>{item.position}</Text>
                  <View style={style.resultEarthquakeContainer}>
                    <Text style={style.resultEarthquakeMessageText}>{item.refMatter}</Text>
                    <Text style={style.resultItemScaleText}>규모 {item.scale}</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DisasterInfoScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
  },
  scrollview: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 30,
    backgroundColor: theme.color.white,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerText: {
    fontSize: 23,
    fontWeight: 'bold',
  },
  mapButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: theme.color.main,
  },
  mapButtonText: {
    fontSize: 14,
    color: theme.color.white,
  },
  categoryContainer: {
    marginTop: 20,
    height: 196,
    alignSelf: 'center',
  },
  columnWrapperStyle: {
    marginBottom: 15,
  },
  categoryItem: {
    width: 80,
    height: 80,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: theme.color.lightGray1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.color.gray,
  },
  categoryLabel: {
    fontSize: 14,
    color: theme.color.darkGray2,
  },
  selectedCategoryStyle: {
    color: theme.color.main,
    fontSize: 14,
  },
  categoryIcon: {
    color: theme.color.darkGray2,
    width: 36,
  },
  selectedCategoryIcon: {
    color: theme.color.main,
    width: 36,
  },
  body: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  regionOptionContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  regionSelectionContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  regionSettingButton: {
    marginLeft: 'auto',
  },
  resultListContainer: {
    flexDirection: 'column',
  },
  resultListItem: {
    paddingVertical: 25,
    gap: 12,
    borderBottomWidth: 1,
    borderColor: theme.color.gray,
  },
  resultItemDateText: {
    fontSize: 14,
    color: theme.color.darkGray1,
  },
  resultItemText: {
    fontSize: 16,
  },
  resultItemScaleText: {
    fontSize: 15,
  },
  resultEarthquakeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultEarthquakeMessageText: {
    fontSize: 14,
    color: theme.color.darkGray2,
  },
});
