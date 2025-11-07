import React, {useEffect} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {theme} from '../theme';
import ProfileHeader from '../components/ProfileHeader';
import MembershipCard from '../components/MembershipCard';
import WalletCard from '../components/WalletCard';
import MenuItem from '../components/MenuItem';
import {profileAtom, initializeProfile} from '../store/profileAtoms';
import {authAtom, clearAuthState} from '../store/authAtoms';

function ProfileScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const auth = useAtomValue(authAtom);
  const [profile, setProfile] = useAtom(profileAtom);
  const setAuth = useSetAtom(authAtom);

  // Initialize profile on mount
  useEffect(() => {
    const initProfile = async () => {
      const profileData = await initializeProfile(auth.phoneNumber);
      setProfile(profileData);
    };
    initProfile();
  }, [auth.phoneNumber, setProfile]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearAuthState();
          setAuth({isLoggedIn: false, phoneNumber: null});
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'time-outline',
      title: 'History',
      onPress: () => (navigation as any).navigate('History'),
    },
    {
      icon: 'card-outline',
      title: 'Top Up',
      onPress: () => (navigation as any).navigate('TopUp'),
    },
    {
      icon: 'wallet-outline',
      title: 'My Wallet',
      value: `${profile.wallet.coins} coins`,
      onPress: () => (navigation as any).navigate('Wallet'),
    },
    {
      icon: 'gift-outline',
      title: 'Earn Rewards',
      badge: `+${profile.wallet.rewards}`,
      onPress: () => (navigation as any).navigate('Rewards'),
    },
    {
      icon: 'download-outline',
      title: 'Downloads',
      onPress: () => (navigation as any).navigate('Downloads'),
    },
    {
      icon: 'gift-outline',
      title: 'Gifts',
      onPress: () => (navigation as any).navigate('Gifts'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & feedback',
      onPress: () => (navigation as any).navigate('Help'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => (navigation as any).navigate('Settings'),
    },
  ];

  // Tab bar height + bottom inset + extra padding
  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        <ProfileHeader />
        <MembershipCard />
        {/* <WalletCard
          onTopUpPress={() => (navigation as any).navigate('TopUp')}
          onDetailPress={() => (navigation as any).navigate('Wallet')}
        /> */}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              value={item.value}
              badge={item.badge}
              onPress={item.onPress}
            />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom will be set dynamically
  },
  menuContainer: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
  },
  logoutButton: {
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.status.error,
  },
  logoutButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.status.error,
  },
});

export default ProfileScreen;
