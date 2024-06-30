import { Tabs } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ELEMENT_WIDTH } from '../../../global';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
          bottom: 10,
          width: ELEMENT_WIDTH*1.1,
          height: 50,
          backgroundColor: 'white',
          borderRadius: 30,
          elevation: 7,
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: 20,
          alignItems: 'center',
          alignSelf: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="collections"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="list-ul" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite-border" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: '',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
