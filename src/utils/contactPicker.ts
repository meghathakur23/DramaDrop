import {Platform} from 'react-native';
import Contacts from 'react-native-contacts';

export interface ContactPhone {
  label: string;
  number: string;
}

/**
 * Open system contact picker and return selected phone number
 * Uses system picker which doesn't require READ_CONTACTS permission
 */
export const pickContactPhone = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'android') {
      // Use system contact picker - no permission needed
      const contact = await Contacts.pickContact();
      if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        // Try to find a mobile number first
        const mobileNumber = contact.phoneNumbers.find(
          p => p.label === 'mobile' || p.label === 'iPhone'
        );
        if (mobileNumber) {
          return formatIndianPhoneNumber(mobileNumber.number);
        }
        // Otherwise use first phone number
        return formatIndianPhoneNumber(contact.phoneNumbers[0].number);
      }
    } else {
      // iOS - use system picker
      const contact = await Contacts.pickContact();
      if (contact && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
        const mobileNumber = contact.phoneNumbers.find(
          p => p.label === 'mobile' || p.label === 'iPhone'
        );
        if (mobileNumber) {
          return formatIndianPhoneNumber(mobileNumber.number);
        }
        return formatIndianPhoneNumber(contact.phoneNumbers[0].number);
      }
    }
    
    return null;
  } catch (error) {
    // User cancelled or error occurred - return null silently
    console.log('Contact picker cancelled or error:', error);
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

