import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: '산불지도',
        }}
      />
      <Tabs.Screen
        name="disasterInfo"
        options={{
          headerShown: false,
          title: '재난 정보',
        }}
      />
      <Tabs.Screen
        name="myPage"
        options={{
          headerShown: false,
          title: '마이페이지',
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
