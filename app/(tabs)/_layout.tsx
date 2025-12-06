import { Tabs } from 'expo-router';
import { FireIcon, InformationIcon, MyPageIcon } from '../../assets/svgs/icons';
import theme from '../../styles/theme';
import { StyleSheet, Text } from 'react-native';

const TabsLayout = () => {
  const tabScreens = [
    { name: 'index', title: '산불지도', Icon: FireIcon },
    { name: 'disasterInfo', title: '재난 정보', Icon: InformationIcon },
    { name: 'myPage', title: '마이페이지', Icon: MyPageIcon },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.color.black,
        tabBarInactiveTintColor: theme.color.darkGray1,
        tabBarStyle: style.tabBar,
      }}
    >
      {tabScreens.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            headerShown: false,
            title: title,
            tabBarIcon: ({ focused }) => (
              <Icon
                color={focused ? theme.color.black : theme.color.darkGray1}
                style={style.icon}
                width={28}
                height={28}
              />
            ),
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, ...style.label }}>{title}</Text>
            ),
          }}
        />
      ))}
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
