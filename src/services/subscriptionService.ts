/**
 * Subscription Service
 * Handles subscription operations and benefits
 */

import {
  SubscriptionType,
  SubscriptionState,
  activateSubscription,
  cancelSubscription,
  isSubscriptionActive,
} from '../store/subscriptionAtoms';

export interface SubscriptionPlan {
  type: SubscriptionType;
  name: string;
  price: number;
  duration: number; // in days
  benefits: string[];
}

// Subscription plans configuration
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    type: 'basic',
    name: 'Basic',
    price: 4.99,
    duration: 30,
    benefits: [
      '720p quality',
      'Ad-light experience',
      '1 device',
    ],
  },
  {
    type: 'premium',
    name: 'Premium Monthly',
    price: 7.99,
    duration: 30,
    benefits: [
      'Full HD quality',
      'Ad-free experience',
      'Up to 2 devices',
    ],
  },
  {
    type: 'premium',
    name: 'Premium Annual',
    price: 79.90,
    duration: 365,
    benefits: [
      'Full HD quality',
      'Ad-free experience',
      'Up to 2 devices',
      '12 months for the price of 10',
    ],
  },
];

/**
 * Get subscription plan by type
 */
export const getSubscriptionPlan = (type: SubscriptionType): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.type === type);
};

/**
 * Get subscription benefits
 */
export const getSubscriptionBenefits = (type: SubscriptionType): string[] => {
  const plan = getSubscriptionPlan(type);
  return plan?.benefits || [];
};

/**
 * Check subscription status
 */
export const checkSubscriptionStatus = (subscription: SubscriptionState): {
  isActive: boolean;
  daysRemaining?: number;
} => {
  const active = isSubscriptionActive(subscription);
  
  if (!active || !subscription.expiryDate) {
    return {isActive: false};
  }

  const expiry = new Date(subscription.expiryDate);
  const now = new Date();
  const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    isActive: true,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
  };
};

/**
 * Activate subscription (with payment processing placeholder)
 */
export const activateSubscriptionWithPayment = async (
  type: SubscriptionType,
  paymentMethod?: string,
): Promise<SubscriptionState> => {
  // TODO: Integrate with payment processing (Stripe, PayPal, etc.)
  // For now, just activate the subscription
  const plan = getSubscriptionPlan(type);
  if (!plan) {
    throw new Error(`Invalid subscription type: ${type}`);
  }

  // Simulate payment processing
  console.log(`Processing payment for ${plan.name} subscription...`);
  
  // Activate subscription
  return activateSubscription(type, plan.duration);
};

/**
 * Cancel subscription
 */
export const cancelUserSubscription = async (): Promise<SubscriptionState> => {
  // TODO: Handle subscription cancellation with payment provider
  return cancelSubscription();
};

