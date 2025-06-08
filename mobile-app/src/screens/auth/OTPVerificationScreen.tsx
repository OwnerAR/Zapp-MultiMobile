import React, { useState, useRef } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const OTPVerificationScreen = ({ route, navigation }: any) => {
  const { kode } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

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
      
      // Navigate to main app
      navigation.replace('Home');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
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
            <Text style={styles.subtitle}>
              Enter the OTP sent to your WhatsApp
            </Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ErrorMessage message={error} />
            </View>
          )}

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref: TextInput | null) => {
                  if (ref) {
                    inputRefs.current[index] = ref;
                  }
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  errorContainer: {
    marginBottom: 20,
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
    paddingHorizontal: 32,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPVerificationScreen;
