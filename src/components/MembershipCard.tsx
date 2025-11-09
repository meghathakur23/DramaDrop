import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useAtom} from 'jotai';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../theme';
import {
  subscriptionAtom,
  initializeSubscription,
} from '../store/subscriptionAtoms';
import {checkSubscriptionStatus} from '../services/subscriptionService';

function MembershipCard() {
  const navigation = useNavigation();
  const [subscription, setSubscription] = useAtom(subscriptionAtom);
  const subscriptionStatus = checkSubscriptionStatus(subscription);

  const handleActivate = async () => {
    // Navigate to subscription screen for activation
    (navigation as any).navigate('Subscription');
  };

  // Initialize subscription on mount
  React.useEffect(() => {
    const init = async () => {
      const sub = await initializeSubscription();
      setSubscription(sub);
    };
    init();
  }, [setSubscription]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B6914', '#D4AF37', '#8B6914']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        {/* Discount Badge */}
        {!subscription.isActive && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>48% off</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
            <View style={styles.titleContainer}>
              {/* <Icon name="diamond" size={20} color={theme.colors.text.primary} /> */}
              <View />
              <Text style={styles.title}>DramaDrop • VIP</Text>
            </View>
               {/* Benefits Title - Below DramaDrop */}
          <Text style={styles.benefitsTitle}>Enjoy these exclusive benefits:</Text>
            </View>
   
            {!subscription.isActive ? (
              <TouchableOpacity
                style={styles.activateButton}
                onPress={handleActivate}
                activeOpacity={0.8}>
                <Text style={styles.activateButtonText}>Activate</Text>
              </TouchableOpacity>
            ) : subscriptionStatus.daysRemaining !== undefined && (
              <Text style={styles.expiryText}>
                {subscriptionStatus.daysRemaining} days left
              </Text>
            )}
          </View>

       

          {/* Benefits Grid */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitsGrid}>
              <View style={{flexDirection: 'row'}}>
              <View style={styles.benefitItem}>
                <Icon name="play-circle" size={16} color={theme.colors.text.primary} />
                <View style={{width: theme.spacing.xs}} />
                <Text style={styles.benefitText}>Unlimited viewing</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="tv" size={16} color={theme.colors.text.primary} />
                <View style={{width: theme.spacing.xs}} />
                <Text style={styles.benefitText}>HD 1080p quality</Text>
              </View>
              </View>
           <View style={{flexDirection: 'row'}}>
           <View style={styles.benefitItem}>
                <Icon name="download" size={16} color={theme.colors.text.primary} />
                <View style={{width: theme.spacing.xs}} />
                <Text style={styles.benefitText}>Download</Text>
              </View>
              <View style={styles.benefitItem}>
                <Icon name="star" size={16} color={theme.colors.text.primary} />
                <View style={{width: theme.spacing.xs}} />
                <Text style={styles.benefitText}>Daily points reward</Text>
              </View>
           </View>
             
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  gradient: {
    padding: theme.spacing.md,
    position: 'relative',
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.status.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  discountText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  content: {
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  activateButton: {
    backgroundColor: '#5D4037',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  activateButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  expiryText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  benefitsTitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  benefitsContainer: {
    marginTop: 0,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  benefitText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    flex: 1,
  },
});

export default MembershipCard;

