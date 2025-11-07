import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';

interface PhoneNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onContactPickerPress: () => void;
  error?: string;
}

function PhoneNumberInput({
  value,
  onChangeText,
  onContactPickerPress,
  error,
}: PhoneNumberInputProps) {
  const handleChangeText = (text: string) => {
    // Remove all non-digit characters and limit to 10 digits
    const cleaned = text.replace(/\D/g, '').substring(0, 10);
    onChangeText(cleaned); // Store as plain digits without spaces
  };

  const displayValue = value || '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone number</Text>
      <TouchableOpacity
        style={[styles.inputContainer, error && styles.inputContainerError]}
        onPress={onContactPickerPress}
        activeOpacity={0.8}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={onContactPickerPress}
            style={styles.contactIcon}>
            <Icon name="call-outline" size={20} color={theme.colors.purple.primary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={displayValue}
            onChangeText={handleChangeText}
            placeholder="Enter phone number"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="phone-pad"
            maxLength={10} // 10 digits only
            editable={true}
            onFocus={() => {
              // Auto-trigger phone number hint on focus
              onContactPickerPress();
            }}
          />
        </View>
      </TouchableOpacity>
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
  inputContainer: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0.2,
    borderColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 50,
  },
  inputContainerError: {
    borderColor: theme.colors.status.error,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    // fontFamily: 'monospace',
    // letterSpacing: 2,
  },
  contactIcon: {
    padding: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  },
});

export default PhoneNumberInput;

