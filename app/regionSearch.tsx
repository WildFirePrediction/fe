import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import theme from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import useGetRegionSearch from '../apis/hooks/useGetRegionSearch';
import usePostUserPreference from '../apis/hooks/usePostUserPreference';
import useGetUserPreference from '../apis/hooks/useGetUserPreference';

const RegionSearch = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const { data: searchData } = useGetRegionSearch(keyword);
  const { data: regionPreferencceData } = useGetUserPreference();
  const postRegion = usePostUserPreference();

  const handleInputChange = (text: string) => {
    setKeyword(text);
  };

  const handlePressItem = (regionId: number) => {
    if (regionPreferencceData !== undefined) {
      let newData = regionPreferencceData.map(region => region.id);
      if (!newData.includes(regionId)) newData = [...newData, regionId];
      postRegion.mutate(newData);
      router.back();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={style.background}>
        <View style={style.searchContainer}>
          <TextInput
            style={style.searchInput}
            value={keyword}
            onChangeText={handleInputChange}
            placeholder="검색"
            placeholderTextColor={theme.color.darkGray1}
          ></TextInput>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={style.searchCancelText}>취소</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.searchResultContainer}>
            {searchData &&
              searchData.map((region, index) => (
                <TouchableOpacity
                  key={`${region}-${index}`}
                  onPress={() => handlePressItem(region.id)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={style.searchResultItem}
                  >{`${region.sido} ${region.sigungu} ${region.eupmyeondong}`}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegionSearch;

const style = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 30,
    color: theme.color.white,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 17,
    borderRadius: 5,
    backgroundColor: theme.color.gray,
  },
  searchCancelText: {
    fontSize: 19,
    color: theme.color.darkGray2,
  },
  searchResultContainer: {
    marginTop: 40,
  },
  searchResultItem: {
    paddingHorizontal: 8,
    paddingVertical: 15,
    fontSize: 17,
    color: theme.color.darkGray2,
  },
});
