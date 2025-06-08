import React, { useState, useEffect } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { transactions } from '../../services/api';
import { Transaction } from '../../types';

export const TransactionsScreen = ({ navigation }: any) => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    try {
      setError(null);
      const response = await transactions.getAll();
      setTransactionList(response);
    } catch (error) {
      setError('Failed to load transactions. Please try again.');
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTransactions().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionId}>#{item.trxid}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'success' ? styles.successBadge : styles.failedBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'success' ? styles.successText : styles.failedText
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Product</Text>
          <Text style={styles.detailValue}>{item.produk}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{item.tujuan}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>
            Rp {item.saldo_terpotong.toLocaleString()}
          </Text>
        </View>
        {item.status === 'success' && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SN</Text>
            <Text style={styles.detailValue}>{item.sn}</Text>
          </View>
        )}
      </View>

      <Text style={styles.timestamp}>
        {item.created_at ? formatDate(item.created_at) : ''}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Transactions"
          onBack={() => navigation.goBack()}
        />
        <ErrorMessage message={error} onRetry={loadTransactions} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Transactions"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={transactionList}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.trxid}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  successBadge: {
    backgroundColor: '#DCFCE7',
  },
  failedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  successText: {
    color: '#059669',
  },
  failedText: {
    color: '#DC2626',
  },
  transactionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
    marginTop: 12,
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default TransactionsScreen;
