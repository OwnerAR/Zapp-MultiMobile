import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, ChevronRight } from 'lucide-react-native';
import Header from '../../components/Header';
import CurrencyInput from '../../components/ui/CurrencyInput';

const QUICK_AMOUNTS = [
  { label: 'Rp 50.000', value: 50000 },
  { label: 'Rp 100.000', value: 100000 },
  { label: 'Rp 200.000', value: 200000 },
  { label: 'Rp 500.000', value: 500000 },
];

export const TopUpScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleTopUp = async () => {
    if (!amount || parseInt(amount) < 10000) {
      return;
    }

    setLoading(true);
    try {
      // Add your top-up API call here
      // await api.topUp(parseInt(amount));
      navigation.goBack();
    } catch (error) {
      console.error('Top up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#111827" strokeWidth={2} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Top Up Balance</Text>
      <View style={styles.headerRight} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <CurrencyInput
              label="Enter Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              maxLength={7}
              error={amount && parseInt(amount) < 10000 ? 'Minimum amount is Rp 10.000' : undefined}
              style={styles.amountInput}
            />

            <Text style={styles.quickAmountLabel}>Quick Amount</Text>
            <View style={styles.quickAmountGrid}>
              {QUICK_AMOUNTS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.quickAmountButton,
                    amount === item.value.toString() && styles.quickAmountButtonActive,
                  ]}
                  onPress={() => handleQuickAmount(item.value)}
                >
                  <Plus 
                    size={16} 
                    color={amount === item.value.toString() ? '#2563EB' : '#6B7280'} 
                    strokeWidth={2.5}
                    style={styles.quickAmountIcon}
                  />
                  <Text style={[
                    styles.quickAmountText,
                    amount === item.value.toString() && styles.quickAmountTextActive,
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!amount || parseInt(amount) < 10000 || loading) && styles.confirmButtonDisabled,
            ]}
            onPress={handleTopUp}
            disabled={!amount || parseInt(amount) < 10000 || loading}
          >
            <Text style={styles.confirmButtonText}>
              {loading ? 'Processing...' : 'Confirm Top Up'}
            </Text>
            {!loading && <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmountButtonActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  quickAmountIcon: {
    marginRight: 4,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickAmountTextActive: {
    color: '#2563EB',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    marginRight: 4,
  },
});

export default TopUpScreen;
