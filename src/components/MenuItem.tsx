import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';

interface MenuItemProps {
  icon: string;
  title: string;
  value?: string;
  badge?: string;
  onPress?: () => void;
}

function MenuItem({icon, title, value, badge, onPress}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={24} color={theme.colors.text.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSection}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        {badge && <View style={{width: theme.spacing.sm}} />}
        {value && <Text style={styles.value}>{value}</Text>}
        {value && <View style={{width: theme.spacing.sm}} />}
        <Icon
          name="chevron-forward"
          size={20}
          color={theme.colors.text.tertiary}
          style={styles.arrow}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.base,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.base - 2, // Reduce by 2px (16 -> 14)
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: theme.colors.status.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  arrow: {
    marginLeft: theme.spacing.xs,
  },
});

export default MenuItem;

