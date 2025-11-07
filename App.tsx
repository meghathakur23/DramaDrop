/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import ForYouScreen from './src/screens/ForYouScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: '#E5E5EA',
            },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Home',
            }}
          />
          <Tab.Screen
            name="ForYou"
            component={ForYouScreen}
            options={{
              title: 'For You',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Profile',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
