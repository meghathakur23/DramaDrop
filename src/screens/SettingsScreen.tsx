import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';
import CommonHeader from '../components/CommonHeader';

function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CommonHeader title="Settings" />
      <View style={styles.content}>
        <Icon name="settings-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyText}>Settings</Text>
        <Text style={styles.emptySubtext}>Configure your app preferences</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default SettingsScreen;

