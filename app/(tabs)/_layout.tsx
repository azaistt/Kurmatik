import React, { useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Import the screens
import HomeScreen from './index';
import ExploreScreen from './explore';
import ChatScreen from '../../src/screens/ChatScreen';

const renderScene = SceneMap({
  home: HomeScreen,
  explore: ExploreScreen,
  chat: ChatScreen,
});

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home' },
    { key: 'explore', title: 'Uyarılar' },
    { key: 'chat', title: 'AI Chat' },
  ]);

  const renderTabBar = (props: any) => {
    const { navigationState, jumpTo } = props;
    return (
      <View style={{ flexDirection: 'row', backgroundColor: Colors[colorScheme ?? 'light'].background }}>
        {navigationState.routes.map((route: any, i: number) => {
          const isActive = i === navigationState.index;
          return (
            <View
              key={route.key}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                backgroundColor: isActive ? Colors[colorScheme ?? 'light'].tint : 'transparent',
                cursor: 'pointer',
              }}
              onTouchStart={() => {
                setIndex(i);
                jumpTo(route.key);
              }}
            >
              <IconSymbol
                size={28}
                name={
                  route.key === 'home' ? 'house.fill' :
                  route.key === 'explore' ? 'bell.fill' :
                  'message.fill'
                }
                color={isActive ? '#FFFFFF' : Colors[colorScheme ?? 'light'].tint}
              />
              <Text style={{
                color: isActive ? '#FFFFFF' : Colors[colorScheme ?? 'light'].text,
                fontSize: 12,
                marginTop: 4
              }}>
                {route.title}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      swipeEnabled={false}
    />
  );
}
