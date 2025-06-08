import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import colors from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../services/api';
import { useAuth } from '../../store/AuthStore';
import Header from '../../components/Header';
import ErrorMessage from '../../components/ErrorMessage';
import OTPInput from '../../components/ui/OTPInput';

export const OTPVerificationScreen = ({ route, navigation }: any) => {
  const { kode } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<any>(null);
  const { setIsAuthenticated } = useAuth();

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response = await auth.verifyOtp(kode, otpString);
      
      // Store the token
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.reseller));
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      // Add your resend OTP API call here
      // await auth.resendOtp(kode);
      console.log('Resending OTP...');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Verify OTP"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <KeyRound size={48} color="#2563EB" strokeWidth={1.5} style={styles.icon} />
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              Enter the OTP sent to your WhatsApp
            </Text>
            <Text style={styles.phoneNumber}>
              +62 {kode.replace(/(\d{4})(\d{4})/, '$1 $2')}
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ErrorMessage message={error} />
            </View>
          )}

          <OTPInput
            ref={inputRefs}
            value={otp}
            onChange={setOtp}
            error={!!error}
            containerStyle={styles.otpContainer}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Verify OTP Button"
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResendOTP}
              style={styles.resendButton}
              accessibilityRole="button"
              accessibilityLabel="Resend OTP Button"
            >
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <Text style={styles.resendActionText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Add space at bottom for keyboard
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  errorContainer: {
    marginBottom: 20,
    width: '100%',
  },
  otpContainer: {
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    height: 56,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: colors.primary.light,
  },
  buttonText: {
    color: colors.common.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  resendActionText: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default OTPVerificationScreen;
