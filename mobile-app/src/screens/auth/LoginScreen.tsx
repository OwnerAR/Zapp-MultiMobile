import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { auth } from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export const LoginScreen = ({ navigation }: any) => {
  const [kode, setKode] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!kode || !pin) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await auth.login(kode, pin);
      navigation.navigate('OTPVerification', { kode });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ErrorMessage message={error} />
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your kode"
                value={kode}
                onChangeText={setKode}
                autoCapitalize="none"
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>PIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your PIN"
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    marginBottom: 20,
  },
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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

export default LoginScreen;
