/**
 * DramaDrop - Vertical Drama Streaming App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, View, StyleSheet, Platform, Pressable} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import ForYouScreen from './src/screens/ForYouScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import SearchScreen from './src/screens/SearchScreen';

const Tab = createBottomTabNavigator();

// Custom dark theme for navigation
const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: theme.colors.blue.primary,
    background: theme.colors.background.primary,
    card: theme.colors.background.secondary,
    text: theme.colors.text.primary,
    border: theme.colors.border.primary,
    notification: theme.colors.purple.primary,
  },
};

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background.secondary,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.semiBold,
          fontSize: theme.typography.fontSize.xl,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          // All icons use outline style - active tabs just have neon blue color
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'ForYou') {
            // Play button enclosed within a rounded square outline
            iconName = 'play-square-outline';
          } else if (route.name === 'Browse') {
            // Grid of nine small squares
            iconName = 'grid-outline';
          } else if (route.name === 'Watchlist') {
            // Bookmark/ribbon outline
            iconName = 'bookmark-outline';
          } else if (route.name === 'Search') {
            // Magnifying glass outline
            iconName = 'search-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.blue.primary,
        tabBarInactiveTintColor: '#CCCCCC', // Light gray/white for inactive tabs
        tabBarStyle: {
          backgroundColor: theme.colors.background.elevated,
          borderTopWidth: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: theme.spacing.md,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
          height: 70 + insets.bottom,
          position: 'absolute',
          ...Platform.select({
            ios: {
              shadowColor: theme.colors.blue.primary,
              shadowOffset: {width: 0, height: -4},
              shadowOpacity: 0.4,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
              borderTopWidth: 2,
              borderTopColor: theme.colors.blue.primary,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: theme.spacing.xs,
        },
        tabBarButton: (props) => {
          const {accessibilityState, style, onPress, onPressIn, onPressOut, ...otherProps} = props;
          const isSelected = accessibilityState?.selected;
          
          return (
            <Pressable
              onPress={onPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={({pressed}) => [
                style,
                isSelected && styles.activeTabBackground,
                pressed && {opacity: 0.7},
              ]}
              {...otherProps}
            >
              {props.children}
            </Pressable>
          );
        },
      })}>
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
        name="Browse"
        component={BrowseScreen}
        options={{
          title: 'Browse',
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          title: 'Watchlist',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Search',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)', // Darker background for active tab
    borderRadius: 14,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <NavigationContainer theme={customDarkTheme}>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
