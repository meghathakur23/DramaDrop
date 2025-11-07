import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAtom} from 'jotai';
import {phoneNumberAtom, otpAtom, authAtom, saveAuthState} from '../store/authAtoms';
import {sendOTP, verifyOTP} from '../services/authService';
import {getPhoneNumberHint, validateIndianPhoneNumber} from '../utils/phoneNumberHint';
import GradientText from '../components/GradientText';
import PhoneNumberInput from '../components/PhoneNumberInput';
import OTPInput from '../components/OTPInput';
import {theme} from '../theme';

interface SignInScreenProps {
  navigation: any;
}

function SignInScreen({navigation}: SignInScreenProps) {
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const [, setAuth] = useAtom(authAtom);
  
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-send OTP when valid phone number is entered
  useEffect(() => {
    if (phoneNumber && phoneNumber.length === 10 && validateIndianPhoneNumber(phoneNumber) && !otpSent && !isSendingOTP) {
      handleSendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber]);

  const handlePhoneNumberHint = async () => {
    try {
      const selectedPhone = await getPhoneNumberHint();
      if (selectedPhone) {
        setPhoneNumber(selectedPhone);
        setPhoneError('');
      }
    } catch (error) {
      console.log('Phone number hint cancelled or error:', error);
      // User cancelled or error - allow manual entry
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!validateIndianPhoneNumber(phoneNumber)) {
      setPhoneError('Phone number must start with 6, 7, 8, or 9');
      return;
    }

    setIsSendingOTP(true);
    setPhoneError('');
    try {
      const response = await sendOTP(phoneNumber);
      if (response.success) {
        setOtpSent(true);
        setResendTimer(60);
        setOtp('');
        setOtpError('');
      } else {
        Alert.alert('Error', response.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  const handleSignIn = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    if (!validateIndianPhoneNumber(phoneNumber)) {
      setPhoneError('Phone number must start with 6, 7, 8, or 9');
      return;
    }

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setPhoneError('');
    setOtpError('');

    try {
      const response = await verifyOTP(phoneNumber, otp);

      if (response.success) {
        // Update auth state
        const authState = {
          isLoggedIn: true,
          phoneNumber,
          userData: {
            id: `user_${Date.now()}`,
            phoneNumber,
          },
        };
        setAuth(authState);
        await saveAuthState(authState);

        // Clear temporary atoms
        setPhoneNumber('');
        setOtp('');

        // Navigation will be handled by App.tsx based on auth state
      } else {
        setOtpError(response.message || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = phoneNumber.length === 10 && 
                      validateIndianPhoneNumber(phoneNumber) && 
                      otp.length === 6;

  return (
    <LinearGradient
     colors={['#2E003E', '#0A001A', '#001427']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    // Adjust locations to control the spread of each color '#3d1431'
    // Example: This pushes the top dark purple a bit down, and the bottom blue a bit up,
    // making the very dark middle section more dominant in the center,
    // similar to your image.
    locations={[0, 0.3, 1]}
      style={styles.gradientBackground}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <GradientText style={styles.title}>DramaDrop</GradientText>
        </View>

        {/* Input Card */}
        <View style={styles.card}>
          <PhoneNumberInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onContactPickerPress={handlePhoneNumberHint}
            error={phoneError}
          />
          {otpSent && (
            <OTPInput
              value={otp}
              onChangeText={setOtp}
              error={otpError}
              autoFocus={true}
            />
          )}
            {isSendingOTP && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.blue.primary} />
              <Text style={styles.loadingText}>Sending OTP...</Text>
            </View>
          )}

          {otpSent && (
            <View style={styles.resendContainer}>
              {resendTimer > 0 ? (
                <Text style={styles.resendTimer}>
                  Resend OTP in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={styles.resendButton}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={!isFormValid || isLoading}>
          <LinearGradient
            colors={[theme.colors.blue.primary, theme.colors.pink.primary]}
            start={{x: 0, y: 2}}
            end={{x: 0, y: 0}}
            locations={[0, 1]}
            style={[styles.gradient, (!isFormValid || isLoading) && styles.gradientDisabled]}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.text.primary} />
            ) : (
              <>
                <Text style={styles.signInButtonText}>Sign In</Text>
                <Icon name="arrow-forward" size={20} color={theme.colors.text.primary} style={styles.arrowIcon} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing you agree to our Terms and Privacy Policy
        </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
    marginTop: theme.spacing['3xl'],
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  resendTimer: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  resendButton: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.purple.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  signInButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  gradientDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  arrowIcon: {
    marginLeft: theme.spacing.xs,
  },
  footerText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});

export default SignInScreen;

