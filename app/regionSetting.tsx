import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CancelIcon, RegionItemDeleteIcon } from '../assets/svgs/icons';
import theme from '../styles/theme';
import { Button } from '../components';
import { useRouter } from 'expo-router';
import useGetUserPreference from '../apis/hooks/useGetUserPreference';
import usePostUserPreference from '../apis/hooks/usePostUserPreference';

const RegionSetting = () => {
  const router = useRouter();

  const { data: myRegions } = useGetUserPreference();
  const postRegions = usePostUserPreference();

  const handleAddRegion = () => {
    router.push('/regionSearch');
  };

  const handleDeleteRegion = (regionId: number) => {
    if (myRegions !== undefined) {
      const newRegions = myRegions
        ?.filter(region => region.id !== regionId)
        .map(region => region.id);
      postRegions.mutate(newRegions);
    }
  };

  return (
    <SafeAreaView style={style.background}>
      <View style={style.header}>
        <CancelIcon style={style.headerCancelButton} onPress={() => router.back()} />
        <Text style={style.headerText}>지역 설정</Text>
      </View>
      <View style={style.contentContainer}>
        <Text style={style.descriptionText}>
          내 지역은 <Text style={style.descriptionHighlightText}>3개</Text>까지 설정 가능합니다
        </Text>
        <View style={style.regionListContainer}>
          {myRegions &&
            myRegions.map(region => (
              <View style={style.regionItem} key={region.eupmyeondong}>
                <Text style={style.regionItemText}>{region.eupmyeondong}</Text>
                <TouchableOpacity onPress={() => handleDeleteRegion(region.id)}>
                  <RegionItemDeleteIcon style={style.regionDeleteButtonIcon} />
                </TouchableOpacity>
              </View>
            ))}
        </View>
        {myRegions && myRegions.length < 3 && (
          <Button buttonType="full" onClick={handleAddRegion} customStyle={style.addRegionButton}>
            지역 추가
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};
export default RegionSetting;

const style = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: theme.color.white,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  header: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    position: 'absolute',
    fontWeight: 'bold',
  },
  headerCancelButton: {
    width: 15,
    height: 15,
    marginRight: 'auto',
    position: 'relative',
  },
  contentContainer: {
    width: '100%',
    marginTop: 55,
  },
  descriptionText: {
    fontSize: 20,
  },
  descriptionHighlightText: {
    color: theme.color.main,
  },
  regionListContainer: {
    gap: 10,
    marginTop: 30,
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
    borderColor: theme.color.gray,
    backgroundColor: theme.color.lightGray2,
  },
  regionItemText: {
    fontSize: 17,
  },
  regionDeleteButtonIcon: {
    width: 7,
    height: 7,
  },
});
