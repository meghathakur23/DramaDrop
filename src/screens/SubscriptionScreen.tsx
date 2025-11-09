import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useAtom, useSetAtom} from 'jotai';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../theme';
import CommonHeader from '../components/CommonHeader';
import {
  subscriptionAtom,
  initializeSubscription,
  activateSubscription,
  cancelSubscription,
  SubscriptionType,
} from '../store/subscriptionAtoms';
import {subscriptionPlans} from '../services/subscriptionService';

function SubscriptionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [subscription, setSubscription] = useAtom(subscriptionAtom);
  const setSubscriptionAtom = useSetAtom(subscriptionAtom);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const sub = await initializeSubscription();
      setSubscriptionAtom(sub);
      // Set selected plan to current active plan
      if (sub.isActive && sub.type !== 'free') {
        const currentPlan = subscriptionPlans.find(
          p => p.type === sub.type && 
          (sub.type === 'premium' ? 
            (sub.nextBillingDate ? 
              new Date(sub.nextBillingDate).getFullYear() !== new Date().getFullYear() ? 
                p.duration === 365 : p.duration === 30 
              : p.duration === 30) 
            : true)
        );
        if (currentPlan) {
          setSelectedPlan(currentPlan.name);
        }
      }
    };
    init();
  }, [setSubscriptionAtom]);

  const handleUpdatePlan = async () => {
    if (!selectedPlan) {
      Alert.alert('Select a Plan', 'Please select a plan to update.');
      return;
    }

    const plan = subscriptionPlans.find(p => p.name === selectedPlan);
    if (!plan) return;

    if (subscription.isActive && subscription.type === plan.type) {
      Alert.alert('Already Active', 'This plan is already your current plan.');
      return;
    }

    Alert.alert(
      'Update Plan',
      `Are you sure you want to update to ${plan.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Update',
          onPress: async () => {
            try {
              const updated = await activateSubscription(
                plan.type,
                plan.duration,
                subscription.paymentMethod,
                subscription.billingEmail,
              );
              setSubscriptionAtom(updated);
              Alert.alert('Success', 'Plan updated successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to update plan. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleCancelPlan = () => {
    Alert.alert(
      'Cancel Plan',
      'Are you sure you want to cancel your subscription?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const updated = await cancelSubscription();
            setSubscriptionAtom(updated);
            setSelectedPlan(null);
            Alert.alert('Cancelled', 'Your subscription has been cancelled.');
          },
        },
      ],
    );
  };

  const handleRestorePurchases = () => {
    Alert.alert('Restore Purchases', 'Restoring your previous purchases...');
    // TODO: Implement restore purchases logic
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number, duration: number) => {
    if (duration === 365) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)} / mo`;
  };

  const getCurrentPlanName = () => {
    if (!subscription.isActive || subscription.type === 'free') {
      return null;
    }
    
    if (subscription.nextBillingDate) {
      const nextBilling = new Date(subscription.nextBillingDate);
      const isAnnual = nextBilling.getFullYear() !== new Date().getFullYear() ||
        (nextBilling.getTime() - new Date().getTime()) > 200 * 24 * 60 * 60 * 1000;
      
      if (subscription.type === 'premium') {
        return isAnnual ? 'Premium (Annual)' : 'Premium (Monthly)';
      }
    }
    
    return subscription.type === 'premium' ? 'Premium (Monthly)' : 
           subscription.type === 'basic' ? 'Basic' : 'Premium';
  };

  const getCurrentPlanPrice = () => {
    if (!subscription.isActive) return null;
    const plan = subscriptionPlans.find(
      p => p.type === subscription.type &&
      (subscription.nextBillingDate ? 
        (new Date(subscription.nextBillingDate).getFullYear() !== new Date().getFullYear() ? 
          p.duration === 365 : p.duration === 30) 
        : p.duration === 30)
    );
    return plan ? formatPrice(plan.price, plan.duration) : null;
  };

  const tabBarHeight = 60 + insets.bottom;
  const bottomPadding = tabBarHeight + theme.spacing.xl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Subscription</Text>
        {subscription.isActive && subscription.type !== 'free' && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        )}
        {!subscription.isActive && <View style={styles.placeholder} />}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: bottomPadding}]}
        showsVerticalScrollIndicator={false}>
        
        {/* Current Plan Section */}
        {subscription.isActive && subscription.type !== 'free' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Current plan</Text>
            <View style={styles.currentPlanRow}>
              <Text style={styles.currentPlanName}>{getCurrentPlanName()}</Text>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Next billing</Text>
              <Text style={styles.infoValue}>
                {formatDate(subscription.nextBillingDate)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>{getCurrentPlanPrice()}</Text>
            </View>
          </View>
        )}

        {/* Choose a Plan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Choose a plan</Text>
          {subscriptionPlans.map((plan) => {
            const isSelected = selectedPlan === plan.name;
            const isCurrentPlan = subscription.isActive && 
              subscription.type === plan.type &&
              (plan.duration === 365 ? 
                subscription.nextBillingDate && 
                new Date(subscription.nextBillingDate).getFullYear() !== new Date().getFullYear()
                : plan.duration === 30);

            return (
              <TouchableOpacity
                key={plan.name}
                style={[styles.planRow, isSelected && styles.planRowSelected]}
                onPress={() => !isCurrentPlan && setSelectedPlan(plan.name)}
                disabled={isCurrentPlan}
                activeOpacity={0.7}>
                <View style={styles.planRowContent}>
                  <Icon
                    name={isSelected || isCurrentPlan ? 'radio-button-on' : 'radio-button-off'}
                    size={24}
                    color={isSelected || isCurrentPlan ? theme.colors.blue.primary : theme.colors.text.secondary}
                  />
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>
                      {plan.benefits.join(', ')}
                    </Text>
                  </View>
                  <Text style={styles.planPrice}>{formatPrice(plan.price, plan.duration)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Method Section */}
        {subscription.isActive && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Payment method</Text>
            <View style={styles.paymentRow}>
              <Icon name="card-outline" size={24} color={theme.colors.text.primary} />
              <Text style={styles.paymentText}>
                {subscription.paymentMethod?.brand || 'Visa'} .... {subscription.paymentMethod?.last4 || '4242'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Billing email</Text>
              <Text style={styles.infoValue}>{subscription.billingEmail || 'you@example.com'}</Text>
            </View>
          </View>
        )}

        {/* Manage Section */}
        {subscription.isActive && subscription.type !== 'free' && (
          <View style={styles.section}>
            <View style={styles.manageRow}>
              <Text style={styles.sectionLabel}>Manage</Text>
              <TouchableOpacity onPress={handleCancelPlan} activeOpacity={0.7}>
                <Text style={styles.cancelPlanText}>Cancel plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdatePlan}
          activeOpacity={0.8}>
          <Text style={styles.updateButtonText}>Update Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          activeOpacity={0.8}>
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Legal Text */}
        <Text style={styles.legalText}>
          By updating, you agree to the Terms and recurring charges until canceled.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  premiumBadge: {
    backgroundColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  premiumBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.base,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  currentPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  currentPlanName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  activeBadge: {
    backgroundColor: theme.colors.purple.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  activeBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  planRow: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  planRowSelected: {
    borderColor: theme.colors.blue.primary,
    borderWidth: 2,
  },
  planRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  planName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  planDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  planPrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  paymentText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  manageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelPlanText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.pink.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  updateButton: {
    backgroundColor: theme.colors.blue.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  updateButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  restoreButton: {
    backgroundColor: theme.colors.background.elevated,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  restoreButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  legalText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default SubscriptionScreen;
