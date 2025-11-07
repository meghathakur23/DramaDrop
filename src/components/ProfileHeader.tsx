import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAtomValue} from 'jotai';
import {theme} from '../theme';
import {profileAtom} from '../store/profileAtoms';
import {authAtom} from '../store/authAtoms';

function ProfileHeader() {
  const profile = useAtomValue(profileAtom);
  const auth = useAtomValue(authAtom);

  // Use profile name or default
  const userName = profile.user.name || 'User';
  const userId = profile.user.userId || (auth.phoneNumber ? auth.phoneNumber.slice(-8) : '');

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          {profile.user.avatar ? (
            <Image source={{uri: profile.user.avatar}} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color={theme.colors.text.secondary} />
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.userIdContainer}>
            <Text style={styles.userId}>ID {userId}</Text>
          </View>
        </View>
      </View>

      {/* Message/Notification Icon */}
      <TouchableOpacity style={styles.messageButton} activeOpacity={0.7}>
        <View style={styles.messageIconContainer}>
          <Icon name="mail-outline" size={24} color={theme.colors.text.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: theme.spacing.base,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  messageButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
});

export default ProfileHeader;

