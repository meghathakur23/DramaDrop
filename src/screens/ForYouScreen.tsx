import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {theme} from '../theme';

function ForYouScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>For You</Text>
      <Text style={styles.subtitle}>Personalized content for you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.blue.primary,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
});

export default ForYouScreen;

