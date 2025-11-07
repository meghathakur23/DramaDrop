import {Platform, NativeModules} from 'react-native';

// Native module for Phone Number Hint API
const {PhoneNumberHint} = NativeModules || {};

/**
 * Get phone number using Android Phone Number Hint API
 * No permissions required - uses system credential picker
 * Falls back to manual entry if native module not available
 */
export const getPhoneNumberHint = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'android' && PhoneNumberHint && PhoneNumberHint.getPhoneNumber) {
      const phoneNumber = await PhoneNumberHint.getPhoneNumber();
      if (phoneNumber) {
        return formatIndianPhoneNumber(phoneNumber);
      }
    }
    // If native module not available, return null (user can enter manually)
    return null;
  } catch (error) {
    // User cancelled or error occurred - return null silently
    console.log('Phone number hint cancelled or error:', error);
    return null;
  }
};

/**
 * Format phone number to Indian format (10 digits)
 * Removes country codes, spaces, and special characters
 */
export const formatIndianPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Remove country code if present (91 for India)
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }
  
  // Return only first 10 digits (Indian phone numbers are 10 digits)
  return cleaned.substring(0, 10);
};

/**
 * Validate Indian phone number
 * Must be 10 digits and start with 6, 7, 8, or 9
 */
export const validateIndianPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return false;
  }
  // Indian mobile numbers start with 6, 7, 8, or 9
  const firstDigit = parseInt(cleaned[0], 10);
  return firstDigit >= 6 && firstDigit <= 9;
};

