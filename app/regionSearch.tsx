import {
  Keyboard,
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

const RegionSearch = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (text: string) => {
    setKeyword(text);
  };

  const handlePressItem = (item: string) => {
    // POST api 호출
    router.back();
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
        <View style={style.searchResultContainer}>
          <Text style={style.searchResultItem} onPress={() => handlePressItem('동작구 흑석동')}>
            동작구 흑석동
          </Text>
          <Text style={style.searchResultItem}>동작구 흑석동</Text>
        </View>
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
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: theme.color.lightGray2,
  },
  searchCancelText: {
    fontSize: 20,
  },
  searchResultContainer: {
    gap: 20,
    marginTop: 40,
  },
  searchResultItem: {
    paddingHorizontal: 8,
    fontSize: 20,
  },
});
