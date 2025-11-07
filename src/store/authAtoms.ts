import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthState {
  isLoggedIn: boolean;
  phoneNumber: string | null;
  userData?: {
    id: string;
    phoneNumber: string;
    name?: string;
    avatar?: string;
  };
}

// Synchronous atoms for state management
export const authAtom = atom<AuthState>({
  isLoggedIn: false,
  phoneNumber: null,
});

// Phone number atom (temporary, for login flow)
export const phoneNumberAtom = atom<string>('');

// OTP atom (temporary, for OTP verification)
export const otpAtom = atom<string>('');

// Helper function to initialize auth state from AsyncStorage
export const initializeAuth = async (): Promise<AuthState> => {
  try {
    const stored = await AsyncStorage.getItem('authState');
    if (stored) {
      return JSON.parse(stored) as AuthState;
    }
    return {isLoggedIn: false, phoneNumber: null};
  } catch (error) {
    console.error('Error initializing auth:', error);
    return {isLoggedIn: false, phoneNumber: null};
  }
};

// Helper function to save auth state to AsyncStorage
export const saveAuthState = async (authState: AuthState): Promise<void> => {
  try {
    await AsyncStorage.setItem('authState', JSON.stringify(authState));
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

// Helper function to clear auth state
export const clearAuthState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authState');
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};
