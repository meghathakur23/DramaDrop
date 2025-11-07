import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';

interface GradientTextProps {
  children: string;
  style?: any;
}

export default function GradientText({ children, style }: GradientTextProps) {
  return (
    <View>
        <Text style={[styles.text]}>
          {children}
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: theme.colors.pink.primary,
    textAlign: 'center',
  },
});
