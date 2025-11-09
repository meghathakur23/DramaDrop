/**
 * Subscription state management using Jotai + AsyncStorage
 * Manages user subscription status and premium access
 */

import {atom} from 'jotai';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionType = 'free' | 'basic' | 'premium' | 'vip';

export interface SubscriptionState {
  type: SubscriptionType;
  isActive: boolean;
  expiryDate?: string; // ISO date string
  activatedDate?: string; // ISO date string
  nextBillingDate?: string; // ISO date string for next billing
  paymentMethod?: {
    type: string; // e.g., 'visa', 'mastercard'
    last4: string; // Last 4 digits
    brand?: string; // Card brand name
  };
  billingEmail?: string; // Billing email address
}

// Base atom for subscription (synchronous)
export const subscriptionAtom = atom<SubscriptionState>({
  type: 'free',
  isActive: false,
});

// Derived atom for premium access check
export const isPremiumAtom = atom((get) => {
  const subscription = get(subscriptionAtom);
  return subscription.isActive && (subscription.type === 'premium' || subscription.type === 'vip');
});

// Derived atom for VIP access check
export const isVipAtom = atom((get) => {
  const subscription = get(subscriptionAtom);
  return subscription.isActive && subscription.type === 'vip';
});

// Initialize subscription from AsyncStorage
export const initializeSubscription = async (): Promise<SubscriptionState> => {
  try {
    const stored = await AsyncStorage.getItem('subscriptionState');
    if (stored) {
      const parsed = JSON.parse(stored) as SubscriptionState;
      // Check if subscription is still valid
      if (parsed.expiryDate) {
        const expiry = new Date(parsed.expiryDate);
        const now = new Date();
        if (expiry < now) {
          // Subscription expired
          return {
            type: 'free',
            isActive: false,
          };
        }
      }
      return parsed;
    }
    return {
      type: 'free',
      isActive: false,
    };
  } catch (error) {
    console.error('Error loading subscription:', error);
    return {
      type: 'free',
      isActive: false,
    };
  }
};

// Helper to save subscription to AsyncStorage
export const saveSubscription = async (subscription: SubscriptionState): Promise<void> => {
  try {
    await AsyncStorage.setItem('subscriptionState', JSON.stringify(subscription));
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
};

// Helper to activate subscription
export const activateSubscription = async (
  type: SubscriptionType,
  durationDays: number = 30,
  paymentMethod?: SubscriptionState['paymentMethod'],
  billingEmail?: string,
): Promise<SubscriptionState> => {
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + durationDays);
  
  // Calculate next billing date (for monthly/annual subscriptions)
  const nextBillingDate = new Date(now);
  if (durationDays === 30) {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  } else if (durationDays === 365) {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  }

  const subscription: SubscriptionState = {
    type,
    isActive: true,
    activatedDate: now.toISOString(),
    expiryDate: expiryDate.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
    paymentMethod: paymentMethod || {
      type: 'visa',
      last4: '4242',
      brand: 'Visa',
    },
    billingEmail: billingEmail || 'you@example.com',
  };

  await saveSubscription(subscription);
  return subscription;
};

// Helper to cancel subscription
export const cancelSubscription = async (): Promise<SubscriptionState> => {
  const subscription: SubscriptionState = {
    type: 'free',
    isActive: false,
  };

  await saveSubscription(subscription);
  return subscription;
};

// Helper to check if subscription is active
export const isSubscriptionActive = (subscription: SubscriptionState): boolean => {
  if (!subscription.isActive) {
    return false;
  }

  if (subscription.expiryDate) {
    const expiry = new Date(subscription.expiryDate);
    const now = new Date();
    return expiry >= now;
  }

  return subscription.isActive;
};

