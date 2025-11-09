/**
 * DramaDrop - Vertical Drama Streaming App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, Platform, View, ActivityIndicator, StyleSheet} from 'react-native';
import {NavigationContainer, DarkTheme, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {useAtomValue, useSetAtom} from 'jotai';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from './src/theme';
import {authAtom, initializeAuth} from './src/store/authAtoms';
import HomeScreen from './src/screens/HomeScreen';
import ForYouScreen from './src/screens/ForYouScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import SignInScreen from './src/screens/SignInScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import TopUpScreen from './src/screens/TopUpScreen';
import WalletScreen from './src/screens/WalletScreen';
import RewardsScreen from './src/screens/RewardsScreen';
import DownloadsScreen from './src/screens/DownloadsScreen';
import GiftsScreen from './src/screens/GiftsScreen';
import HelpScreen from './src/screens/HelpScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import SearchScreen from './src/screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();
const MainStack = createStackNavigator();

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

function MainStackNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colors.background.primary},
      }}>
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <MainStack.Screen name="Search" component={SearchScreen} />
    </MainStack.Navigator>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
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
        tabBarIcon: ({color}) => {
          let iconName: string;

          // All icons use outline style - active tabs just have neon blue color
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'ForYou') {
            // iconName = 'flame-outline';
            // Play button enclosed within a rounded square outline
            iconName = 'play-circle-outline';
          } else if (route.name === 'Browse') {
            // Grid of nine small squares
            iconName = 'grid-outline';
          } else if (route.name === 'Watchlist') {
            // Bookmark/ribbon outline
            iconName = 'bookmark-outline';
          } else if (route.name === 'Profile') {
            // Magnifying glass outline
            iconName = 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.blue.primary,
        tabBarInactiveBackgroundColor: theme.colors.background.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary, // Light gray/white for inactive tabs
        tabBarStyle: {
          borderTopWidth: 0,
          paddingTop: 0,
          paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
          height: 60 + insets.bottom,
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
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.primary,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          marginTop: 0,
        },
        tabBarItemStyle: {
          backgroundColor: theme.colors.background.primary,
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false, // Hide default header since we have custom AppHeader
        }}
      />
      <Tab.Screen
        name="ForYou"
        component={ForYouScreen}
        options={{
          title: 'For You',
          headerShown: false, // Hide header for full-screen video experience
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
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colors.background.primary},
      }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
}

// Wrapper component to hide tab bar for profile sub-screens
function withHiddenTabBar<T extends React.ComponentType<any>>(
  Component: T,
  showTabBar: boolean = false,
): React.ComponentType<any> {
  return function WrappedComponent(props: any) {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    React.useEffect(() => {
      const tabNavigator = navigation.getParent();
      if (tabNavigator && 'setOptions' in tabNavigator) {
        if (showTabBar) {
          (tabNavigator as any).setOptions({
            tabBarStyle: {
              borderTopWidth: 0,
              paddingTop: 0,
              paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
              height: 60 + insets.bottom,
              position: 'absolute',
              display: 'flex',
            },
          });
        } else {
          (tabNavigator as any).setOptions({
            tabBarStyle: {display: 'none'},
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, insets.bottom]);

    return <Component {...props} />;
  };
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colors.background.primary},
      }}>
      <ProfileStack.Screen name="ProfileMain" component={withHiddenTabBar(ProfileScreen, true)} />
      <ProfileStack.Screen name="History" component={withHiddenTabBar(HistoryScreen, false)} />
      <ProfileStack.Screen name="TopUp" component={withHiddenTabBar(TopUpScreen, false)} />
      <ProfileStack.Screen name="Wallet" component={withHiddenTabBar(WalletScreen, false)} />
      <ProfileStack.Screen name="Rewards" component={withHiddenTabBar(RewardsScreen, false)} />
      <ProfileStack.Screen name="Downloads" component={withHiddenTabBar(DownloadsScreen, false)} />
      <ProfileStack.Screen name="Gifts" component={withHiddenTabBar(GiftsScreen, false)} />
      <ProfileStack.Screen name="Help" component={withHiddenTabBar(HelpScreen, false)} />
      <ProfileStack.Screen name="Settings" component={withHiddenTabBar(SettingsScreen, false)} />
      <ProfileStack.Screen name="Subscription" component={withHiddenTabBar(SubscriptionScreen, false)} />
    </ProfileStack.Navigator>
  );
}

function AppNavigator() {
  const authState = useAtomValue(authAtom);
  const setAuth = useSetAtom(authAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from AsyncStorage
    const initAuth = async () => {
      const initialState = await initializeAuth();
      setAuth(initialState);
      setIsLoading(false);
    };
    initAuth();
  }, [setAuth]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.blue.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={customDarkTheme}>
      {authState.isLoggedIn ? (
        <MainStackNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
});

export default App;
