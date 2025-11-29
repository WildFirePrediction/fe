import { Tabs } from 'expo-router';
import { FireIcon, InformationIcon, MyPageIcon } from '../../assets/svgs/icons';
import theme from '../../styles/theme';
import { StyleSheet, Text } from 'react-native';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.black,
        tabBarInactiveTintColor: theme.color.darkGray1,
        tabBarStyle: style.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: '산불지도',
          tabBarIcon: ({ focused }) => (
            <FireIcon
              color={focused ? theme.color.black : theme.color.darkGray1}
              style={style.icon}
              width={28}
              height={28}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, ...style.label }}>산불지도</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="disasterInfo"
        options={{
          headerShown: false,
          title: '재난 정보',
          tabBarIcon: ({ focused }) => (
            <InformationIcon
              color={focused ? theme.color.black : theme.color.darkGray1}
              style={style.icon}
              width={28}
              height={28}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, ...style.label }}>재난 정보</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="myPage"
        options={{
          headerShown: false,
          title: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <MyPageIcon
              color={focused ? theme.color.black : theme.color.darkGray1}
              style={style.icon}
              width={28}
              height={28}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, ...style.label }}>마이페이지</Text>
          ),
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;

const style = StyleSheet.create({
  tabBar: {
    height: 90,
  },
  icon: {
    marginTop: 10,
  },
  label: {
    fontSize: 10,
    marginTop: 8,
  },
});
