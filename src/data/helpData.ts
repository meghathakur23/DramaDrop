/**
 * Help and Support data
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: 'email' | 'chat' | 'link' | 'feedback';
  value?: string; // Email address, URL, etc.
}

export const faqItems: FAQItem[] = [
  {
    question: 'How to download videos?',
    answer: 'To download videos, you need a Premium or VIP subscription. Once subscribed, you can tap the download icon on any video to save it for offline viewing. Downloaded videos are available in the Downloads section of your profile.',
  },
  {
    question: 'How to cancel subscription?',
    answer: 'You can cancel your subscription at any time by going to Profile > Subscriptions > Manage Subscription, then tap "Cancel plan". Your subscription will remain active until the end of the current billing period.',
  },
  {
    question: 'How to change payment method?',
    answer: 'To update your payment method, go to Profile > Subscriptions > Manage Subscription. You can update your payment information in the Payment method section. Changes will take effect immediately for future billing cycles.',
  },
  {
    question: 'How to watch premium content?',
    answer: 'Premium content requires a Premium or VIP subscription. You can subscribe by going to Profile > Subscriptions and selecting a plan. Once subscribed, all premium content will be unlocked.',
  },
  {
    question: 'How to clear watch history?',
    answer: 'To clear your watch history, go to Profile > History. Tap "Clear All" to remove all items from your watch history. You can also remove individual items by tapping the X button on each history card.',
  },
  {
    question: 'How to restore purchases?',
    answer: 'If you\'ve previously purchased a subscription and it\'s not showing, go to Profile > Subscriptions and tap "Restore Purchases". This will restore your subscription if it was purchased on this device or account.',
  },
  {
    question: 'Video playback issues?',
    answer: 'If you\'re experiencing video playback issues, try: 1) Check your internet connection, 2) Clear the app cache, 3) Restart the app, 4) Update to the latest version. If problems persist, contact support.',
  },
  {
    question: 'How to change account settings?',
    answer: 'You can change your account settings by going to Profile > Settings. Here you can update your profile information, notification preferences, and app settings.',
  },
];

export const supportOptions: SupportOption[] = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'Get help via email',
    icon: 'mail-outline',
    action: 'email',
    value: 'support@dramadrop.com',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: 'chatbubble-outline',
    action: 'chat',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    description: 'Share your thoughts and suggestions',
    icon: 'chatbox-outline',
    action: 'feedback',
  },
];

export const commonIssues = [
  {
    title: 'Video not playing',
    solution: 'Check your internet connection and try again. If the issue persists, restart the app.',
  },
  {
    title: 'Subscription not activating',
    solution: 'Try restoring purchases. If that doesn\'t work, contact support with your purchase receipt.',
  },
  {
    title: 'Download failed',
    solution: 'Ensure you have enough storage space and a stable internet connection. Premium subscription is required for downloads.',
  },
  {
    title: 'App crashes',
    solution: 'Update to the latest version of the app. If the problem continues, try clearing the app cache or reinstalling.',
  },
];

