import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';

export const MutasiScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedPeriod, setSelectedPeriod] = React.useState('This Month');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const periods = ['This Month', 'Last Month', 'Last 3 Months'];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mutasi" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.periodSelector}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{selectedPeriod}</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={[styles.summaryAmount, styles.credit]}>
                  +Rp 500,000
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Expense</Text>
                <Text style={[styles.summaryAmount, styles.debit]}>
                  -Rp 300,000
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.mutasiCard}>
            <View style={styles.mutasiHeader}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
            </View>
            
            {/* Today's transactions */}
            <View style={styles.dateGroup}>
              <Text style={styles.dateLabel}>Today</Text>
              <View style={styles.mutasiItem}>
                <View style={styles.mutasiInfo}>
                  <Text style={styles.mutasiTitle}>Balance Transfer</Text>
                  <Text style={styles.mutasiTime}>15:45</Text>
                </View>
                <Text style={[styles.amount, styles.debit]}>-Rp 75,000</Text>
              </View>
              <View style={styles.mutasiItem}>
                <View style={styles.mutasiInfo}>
                  <Text style={styles.mutasiTitle}>Received Payment</Text>
                  <Text style={styles.mutasiTime}>10:30</Text>
                </View>
                <Text style={[styles.amount, styles.credit]}>+Rp 150,000</Text>
              </View>
            </View>

            {/* Yesterday's transactions */}
            <View style={styles.dateGroup}>
              <Text style={styles.dateLabel}>Yesterday</Text>
              <View style={styles.mutasiItem}>
                <View style={styles.mutasiInfo}>
                  <Text style={styles.mutasiTitle}>Product Purchase</Text>
                  <Text style={styles.mutasiTime}>14:20</Text>
                </View>
                <Text style={[styles.amount, styles.debit]}>-Rp 125,000</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  periodButtonActive: {
    backgroundColor: '#2563EB',
  },
  periodButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  mutasiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mutasiHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  mutasiItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mutasiInfo: {
    flex: 1,
  },
  mutasiTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  mutasiTime: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  debit: {
    color: '#DC2626',
  },
  credit: {
    color: '#059669',
  },
});

export default MutasiScreen;
