import React from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function AppHeader() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const handleVIPPress = () => {
    (navigation as any).navigate('Profile', {
      screen: 'Subscription',
    });
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={handleSearchPress}
        activeOpacity={0.7}>
        <Icon name="search" size={18} color={theme.colors.text.secondary} style={styles.searchIcon} />
        <View style={styles.searchPlaceholder}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dramas..."
            placeholderTextColor={theme.colors.text.tertiary}
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="notifications-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={handleVIPPress}
          activeOpacity={0.7}>
          <Icon name="diamond" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: theme.spacing.base,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
  },
  searchInput: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    padding: 0,
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
});

export default AppHeader;

