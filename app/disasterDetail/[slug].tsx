import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../styles/theme';
import { CancelIcon } from '../../assets/svgs/icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { disasterDetailInfoData } from '../../mock/disasterDetailInfoData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { disasterColorMap } from '../../constants/categories';

const DisasterInfoDetail = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <TouchableOpacity style={style.backButton} onPress={() => router.back()}>
          <CancelIcon />
        </TouchableOpacity>
        <Text style={style.headerText}>상세 정보</Text>
        <View style={{ ...style.categoryBadge, backgroundColor: disasterColorMap['FLOOD'] }}>
          <Text style={style.categoryBadgeText}>홍수</Text>
        </View>
      </View>
      <View style={style.informationConatiner}>
        {disasterDetailInfoData.map((info, index) => (
          <View key={`${info.label}-${index}`} style={style.informationElement}>
            <Text style={style.informationLabelText}>{info.label}</Text>
            <Text style={style.informationContentText}>{info.content}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default DisasterInfoDetail;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.white,
    paddingHorizontal: 40,
  },
  header: {
    width: '100%',
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  backButton: {
    marginEnd: 'auto',
  },
  headerText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.color.rain,
  },
  categoryBadgeText: {
    fontSize: 15,
    color: theme.color.white,
  },
  informationConatiner: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'column',
    gap: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: theme.color.lightGray2,
    alignSelf: 'center',
  },
  informationElement: {
    flexDirection: 'row',
    gap: 10,
  },
  informationLabelText: {
    fontSize: 15,
    color: theme.color.darkGray2,
  },
  informationContentText: {
    fontSize: 15,
  },
});
