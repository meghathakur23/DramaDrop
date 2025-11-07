import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAtomValue} from 'jotai';
import {theme} from '../theme';
import {profileAtom} from '../store/profileAtoms';

interface WalletCardProps {
  onTopUpPress?: () => void;
  onDetailPress?: () => void;
}

function WalletCard({onTopUpPress, onDetailPress}: WalletCardProps) {
  const profile = useAtomValue(profileAtom);
  const {wallet} = profile;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity onPress={onDetailPress} activeOpacity={0.7}>
          <Text style={styles.detailLink}>Detail {'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceContainer}>
        <View style={styles.balanceItem}>
          <View style={styles.iconContainer}>
            <Icon name="logo-bitcoin" size={24} color="#FFD700" />
          </View>
          <View style={{width: theme.spacing.sm}} />
          <Text style={styles.balanceValue}>{wallet.coins}</Text>
        </View>

        <View style={styles.balanceItem}>
          <View style={styles.iconContainer}>
            <Icon name="star" size={24} color="#FFD700" />
          </View>
          <View style={{width: theme.spacing.sm}} />
          <Text style={styles.balanceValue}>{wallet.points}</Text>
        </View>

        <TouchableOpacity
          style={styles.topUpButton}
          onPress={onTopUpPress}
          activeOpacity={0.8}>
          <Text style={styles.topUpButtonText}>Top Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg - 2, // Reduce by 2px (18 -> 16)
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  detailLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.blue.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  topUpButton: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  topUpButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
});

export default WalletCard;

