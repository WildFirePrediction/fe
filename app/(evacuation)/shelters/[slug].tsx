import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import theme from '../../../styles/theme';
import { CancelIcon } from '../../../assets/svgs/icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shelterDetailData } from '../../../mock/shelterDetailData';

const ShelterDetail = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <SafeAreaView style={style.container}>
      <View style={style.header}>
        <TouchableOpacity style={style.backButton} onPress={() => router.back()}>
          <CancelIcon />
        </TouchableOpacity>
        <Text style={style.headerText}>대피소 상세 정보</Text>
      </View>
      <View style={style.bodyContainer}>
        <Text style={style.titleText}>{shelterDetailData.name}</Text>
        <View style={style.informationConatiner}>
          <View style={style.informationElement}>
            <Text style={style.informationLabelText}>주소</Text>
            <Text style={style.informationContentText}>{shelterDetailData.address}</Text>
          </View>
          <View style={style.informationElement}>
            <Text style={style.informationLabelText}>면적</Text>
            <Text style={style.informationContentText}>{shelterDetailData.size} m²</Text>
          </View>
          <View style={style.informationElement}>
            <Text style={style.informationLabelText}>수용인원</Text>
            <Text style={style.informationContentText}>{shelterDetailData.people}명</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ShelterDetail;

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
  bodyContainer: {
    gap: 10,
    marginTop: 40,
  },
  titleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginStart: 7,
  },
  informationConatiner: {
    width: '100%',
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
    flex: 1,
  },
});
