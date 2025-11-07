/**
 * Profile state management using Jotai + AsyncStorage
 * Manages user profile, membership, and wallet data
 */

import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  avatar?: string;
  userId: string;
}

export interface MembershipStatus {
  isMember: boolean;
  membershipType?: 'basic' | 'premium' | 'vip';
  discountPercentage?: number;
}

export interface WalletBalance {
  coins: number;
  points: number;
  rewards: number;
}

export interface ProfileState {
  user: UserProfile;
  membership: MembershipStatus;
  wallet: WalletBalance;
}

// Base atom for profile state (synchronous)
export const profileAtom = atom<ProfileState>({
  user: {
    name: 'User',
    userId: '',
  },
  membership: {
    isMember: false,
  },
  wallet: {
    coins: 0,
    points: 0,
    rewards: 0,
  },
});

// Initialize profile from AsyncStorage
export const initializeProfile = async (phoneNumber: string | null): Promise<ProfileState> => {
  try {
    const stored = await AsyncStorage.getItem('profileState');
    if (stored) {
      const parsed = JSON.parse(stored) as ProfileState;
      // Update userId if phone number is available
      if (phoneNumber && !parsed.user.userId) {
        parsed.user.userId = generateUserId(phoneNumber);
      }
      return parsed;
    }
    // Create default profile
    return {
      user: {
        name: 'User',
        userId: phoneNumber ? generateUserId(phoneNumber) : '',
      },
      membership: {
        isMember: false,
        discountPercentage: 48,
      },
      wallet: {
        coins: 10,
        points: 0,
        rewards: 70,
      },
    };
  } catch (error) {
    console.error('Error loading profile:', error);
    return {
      user: {
        name: 'User',
        userId: phoneNumber ? generateUserId(phoneNumber) : '',
      },
      membership: {
        isMember: false,
        discountPercentage: 48,
      },
      wallet: {
        coins: 10,
        points: 0,
        rewards: 70,
      },
    };
  }
};

// Helper to save profile to AsyncStorage
export const saveProfile = async (profile: ProfileState): Promise<void> => {
  try {
    await AsyncStorage.setItem('profileState', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

// Generate user ID from phone number
const generateUserId = (phoneNumber: string): string => {
  // Use last 8 digits of phone number as user ID
  return phoneNumber.slice(-8);
};

// Helper to update membership status
export const updateMembership = async (
  profile: ProfileState,
  isMember: boolean,
  membershipType?: 'basic' | 'premium' | 'vip',
): Promise<ProfileState> => {
  const updated = {
    ...profile,
    membership: {
      ...profile.membership,
      isMember,
      membershipType,
    },
  };
  await saveProfile(updated);
  return updated;
};

// Helper to update wallet balance
export const updateWallet = async (
  profile: ProfileState,
  wallet: Partial<WalletBalance>,
): Promise<ProfileState> => {
  const updated = {
    ...profile,
    wallet: {
      ...profile.wallet,
      ...wallet,
    },
  };
  await saveProfile(updated);
  return updated;
};

