import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';

interface CommonHeaderProps {
  title: string;
  showBackButton?: boolean;
}

function CommonHeader({title, showBackButton = true}: CommonHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBackButton ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, styles.titleWithBack]}>{title}</Text>
          <View style={styles.placeholder} />
        </>
      ) : (
        <Text style={[styles.title, styles.titleCentered]}>{title}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  titleWithBack: {
    textAlign: 'left',
  },
  titleCentered: {
    textAlign: 'center',
  },
  placeholder: {
    width: 32, // Same width as back button to center title
  },
});

export default CommonHeader;

