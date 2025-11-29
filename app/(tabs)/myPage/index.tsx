import { FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowIcon, CallIcon, SettingIcon } from '../../../assets/svgs/icons';
import { useState } from 'react';
import { disasters, disasterToKorMap } from '../../../constants/categories';
import { useRouter } from 'expo-router';
import { Disaster } from '../../../types/disaster';

const MyPageScreen = () => {
  const router = useRouter();
  const [isCallOn, setIsCallOn] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Disaster[]>([]);

  const toggleSwitch = () => {
    setIsCallOn(prev => !prev);
  };

  const handleSetRegion = () => {
    router.push('/regionSetting');
  };

  const handleToggleCategory = (category: Disaster) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(value => value !== category) : [...prev, category],
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <Text style={style.headerText}>마이페이지</Text>
      </View>
      <View style={style.callSettingContainer}>
        <View style={style.callSettingHeader}>
          <CallIcon width={21} height={21} />
          <Text style={style.callSettingText}>전화 대피 안내 서비스</Text>
          <Switch
            style={style.callSettingToggle}
            trackColor={{ true: theme.color.black }}
            onValueChange={toggleSwitch}
            value={isCallOn}
          />
        </View>
        <Text style={style.callSettingDetailText}>
          전화 대피 안내 서비스는 산불 발생 시 전화로 재난 발생 상황 및 대피 안내를 제공하는
          서비스입니다.
        </Text>
      </View>
      <View style={style.section}>
        <View style={style.sectionLabel}>
          <SettingIcon style={style.sectionLabelIcon} width={18} height={18} />
          <Text style={style.sectionLabelText}>설정</Text>
        </View>
        <View style={style.sectionBody}>
          <TouchableOpacity style={style.menuItem} activeOpacity={0.7} onPress={handleSetRegion}>
            <Text style={style.menuItemText}>지역 설정</Text>
            <ArrowIcon />
          </TouchableOpacity>
          <View style={style.notificationContainer}>
            <Text style={style.menuItemText}>재난 유형별 알림 설정</Text>
            <FlatList
              data={disasters}
              columnWrapperStyle={style.columnWrapperStyle}
              numColumns={2}
              onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
              scrollEnabled={false}
              keyExtractor={item => item}
              renderItem={({ item }) => {
                const selected = selectedCategories.includes(item);
                return (
                  <TouchableOpacity
                    style={[
                      style.notificationItem,
                      selected && style.selectedNotificationItem,
                      { width: (containerWidth - 2) / 2 },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleToggleCategory(item)}
                  >
                    <Text
                      style={
                        selected
                          ? [style.notificationItemText, style.selectedNotificationItemText]
                          : style.notificationItemText
                      }
                    >
                      {disasterToKorMap[item]}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        {/* <View style={style.section}>
          <View style={style.sectionLabel}>
            <InformationIcon style={style.sectionLabelIcon} width={20} height={20} />
            <Text style={style.sectionLabelText}>고객 지원</Text>
          </View>
          <View style={style.sectionBody}>
            <TouchableOpacity style={style.menuItem} activeOpacity={0.7}>
              <Text style={style.menuItemText}>이용 약관</Text>
              <ArrowIcon />
            </TouchableOpacity>
          </View>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default MyPageScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.lightGray1,
    paddingHorizontal: 30,
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
  callSettingContainer: {
    marginTop: 20,
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 7,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.1,
  },
  callSettingHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  callSettingText: {
    fontSize: 17,
  },
  callSettingToggle: {
    marginLeft: 'auto',
  },
  callSettingDetailText: {
    fontSize: 14,
    color: theme.color.darkGray1,
  },
  section: {
    gap: 9,
    marginTop: 30,
  },
  sectionLabel: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingLeft: 5,
  },
  sectionLabelIcon: {
    color: theme.color.black,
    width: 24,
    height: 24,
  },
  sectionLabelText: {
    fontSize: 20,
  },
  sectionBody: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 20,
    borderRadius: 20,
    backgroundColor: theme.color.white,
    shadowColor: theme.color.black,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.color.gray,
  },
  menuItemText: {
    fontSize: 17,
  },
  notificationContainer: {
    gap: 20,
    paddingHorizontal: 10,
  },
  columnWrapperStyle: {
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 10,
    backgroundColor: theme.color.lightGray1,
  },
  selectedNotificationItem: {
    backgroundColor: theme.color.main,
  },
  notificationItemText: {
    fontSize: 15,
  },
  selectedNotificationItemText: {
    color: theme.color.white,
  },
});
