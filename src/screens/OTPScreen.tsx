import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useAtom} from 'jotai';
import {phoneNumberAtom, otpAtom, authAtom, saveAuthState} from '../store/authAtoms';
import {verifyOTP, sendOTP} from '../services/authService';
import {theme} from '../theme';

interface OTPScreenProps {
  navigation: any;
}

function OTPScreen({navigation}: OTPScreenProps) {
  const [phoneNumber] = useAtom(phoneNumberAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const [, setAuth] = useAtom(authAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-focus input on mount
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
      return;
    }

    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not found');
      navigation.goBack();
      return;
    }

    setIsLoading(true);
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
        
        // Save to AsyncStorage
        await saveAuthState(authState);
        
        // Clear OTP
        setOtp('');
        
        // Navigate to main app (will be handled by App.tsx based on auth state)
        // The navigation will happen automatically when auth state changes
      } else {
        Alert.alert('Verification Failed', response.message || 'Invalid OTP');
        setOtp('');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber || !canResend) return;

    setIsLoading(true);
    try {
      const response = await sendOTP(phoneNumber);
      if (response.success) {
        Alert.alert('Success', 'OTP resent successfully');
        setResendTimer(60);
        setCanResend(false);
        setOtp('');
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display (e.g., +1 (234) 567-8900)
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          We sent a verification code to{'\n'}
          <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber || '')}</Text>
        </Text>

        <View style={styles.otpContainer}>
          <TextInput
            ref={inputRef}
            style={styles.otpInput}
            value={otp}
            onChangeText={text => {
              // Only allow numeric input and max 6 digits
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
              setOtp(numericText);
              
              // Auto-submit when 6 digits are entered
              if (numericText.length === 6) {
                Keyboard.dismiss();
                setTimeout(() => handleVerify(), 300);
              }
            }}
            placeholder="000000"
            placeholderTextColor={theme.colors.text.tertiary}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            selectTextOnFocus
          />
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={isLoading || otp.length !== 6}>
          <LinearGradient
            colors={[theme.colors.blue.primary, theme.colors.purple.primary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[
              styles.gradient,
              (isLoading || otp.length !== 6) && styles.gradientDisabled,
            ]}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.text.primary} />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={isLoading}>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendTimer}>
              Resend in {resendTimer}s
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing['3xl'],
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  phoneNumber: {
    color: theme.colors.blue.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  otpContainer: {
    marginBottom: theme.spacing.xl,
  },
  otpInput: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: theme.spacing.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  verifyButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginTop: theme.spacing.lg,
  },
  gradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  resendText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  resendLink: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.blue.primary,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  resendTimer: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
  },
});

export default OTPScreen;

