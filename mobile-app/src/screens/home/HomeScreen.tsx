import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../types';
import Header from '../../components/Header';
import ErrorMessage from '../../components/ErrorMessage';

export const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    try {
      setError(null);
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      setError('Error loading user data. Pull down to refresh.');
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadUserData().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const LogoutButton = () => (
    <TouchableOpacity onPress={handleLogout}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={`Welcome, ${user?.kode || 'User'}`}
        rightComponent={<LogoutButton />}
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
          </View>
        )}

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>
            Rp {user?.saldo?.toLocaleString() || '0'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.actionButtonText}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Transactions')}
            >
              <Text style={styles.actionButtonText}>Transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <View style={styles.userInfoCard}>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Code</Text>
              <Text style={styles.userInfoValue}>{user?.kode || '-'}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Access Level</Text>
              <Text style={styles.userInfoValue}>{user?.hakAkses || '-'}</Text>
            </View>
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>Phone</Text>
              <Text style={styles.userInfoValue}>{user?.nohp || '-'}</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    margin: 16,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  userInfoSection: {
    padding: 16,
  },
  userInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
});

export default HomeScreen;
