import { Tabs } from 'expo-router';

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: 'whildfireMap',
          title: '산불지도',
        }}
      />
      <Tabs.Screen
        name="disasterInfo"
        options={{
          headerTitle: 'disasterInformation',
          title: '재난 정보',
        }}
      />
      <Tabs.Screen
        name="myPage"
        options={{
          headerTitle: 'my page',
          title: '마이페이지',
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;
