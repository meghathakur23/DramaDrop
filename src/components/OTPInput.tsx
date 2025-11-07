import React, {useRef, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {theme} from '../theme';

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  autoFocus?: boolean;
}

function OTPInput({value, onChangeText, error, autoFocus = true}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const handleChangeText = (text: string) => {
    // Only allow digits, max 6
    const cleaned = text.replace(/\D/g, '').substring(0, 6);
    onChangeText(cleaned);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>OTP code</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={handleChangeText}
        placeholder="000000"
        placeholderTextColor={theme.colors.text.tertiary}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus={autoFocus}
        selectTextOnFocus
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.2,
    borderColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 8,
    fontWeight: theme.typography.fontWeight.bold,
    minHeight: 50,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },
});

export default OTPInput;

