import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon, RegionItemDeleteIcon } from '../assets/svgs/icons';
import theme from '../styles/theme';
import { Button } from '../components';
import { myRegionData } from '../mock/myRegionsData';
import { useRouter } from 'expo-router';

const LocaitonSetting = () => {
  const router = useRouter();

  const handleAddRegion = () => {
    router.push('/regionSearch');
  };

  const handleDeleteRegion = () => {};

  return (
    <SafeAreaView style={style.background}>
      <View style={style.header}>
        <Text style={style.headerText}>지역 설정</Text>
        <CancelIcon style={style.headerCancelButton} onPress={() => router.back()} />
      </View>
      <View style={style.contentContainer}>
        <Text style={style.descriptionText}>
          내 지역은 <Text style={style.descriptionHighlightText}>3개</Text>까지 설정 가능합니다
        </Text>
        <View style={style.regionListContainer}>
          {myRegionData.map(region => (
            <View style={style.regionItem} key={region.name}>
              <Text style={style.regionItemText}>{region.name}</Text>
              <RegionItemDeleteIcon onPress={() => handleDeleteRegion()} />
            </View>
          ))}
        </View>
        {myRegionData.length < 3 && (
          <Button buttonType="full" onClick={handleAddRegion} customStyle={style.addRegionButton}>
            지역 추가
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};
export default LocaitonSetting;

const style = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.color.white,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  header: {
    width: '100%',
    marginTop: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    position: 'absolute',
  },
  headerCancelButton: {
    marginLeft: 'auto',
    position: 'relative',
  },
  contentContainer: {
    marginTop: 65,
  },
  descriptionText: {
    fontSize: 24,
  },
  descriptionHighlightText: {
    color: theme.color.main,
  },
  regionListContainer: {
    gap: 10,
    marginTop: 42,
  },
  addRegionButton: {
    marginTop: 28,
  },
  regionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.color.darkGray1,
    backgroundColor: theme.color.lightGray2,
  },
  regionItemText: {
    fontSize: 24,
  },
});
