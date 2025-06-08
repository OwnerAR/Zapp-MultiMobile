import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus } from 'lucide-react-native';
import { User } from '../../types';
const { colors } = require('../../constants/colors');
import Header from '../../components/Header';
import ErrorMessage from '../../components/ErrorMessage';
import { menu } from '../../services/api';
import MenuList from '../../components/ui/MenuList';

type MenuItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
};

export const HomeScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const loadUserData = async () => {
    try {
      setError(null);
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      setError('error, please try again later');
      console.error('Error loading user data:', error);
    }
  };

  const loadMenu = async () => {
    try {
      setLoadingMenu(true);
      setError(null);
      const res = await menu.getAll();
      console.log('Menu items:', res);
      setMenuItems(res || []);
    } catch (error) {
      setError('error, please try again later');
      setMenuItems([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([loadUserData(), loadMenu()]).finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadUserData();
    loadMenu();
  }, []);

  const handleTopUp = () => {
    navigation.navigate('TopUp');
  };
  const handleMenuPress = (item: MenuItem) => {
    // Navigasi sesuai kebutuhan, misal:
    // navigation.navigate(item.route);
    // Atau tampilkan alert:
    alert(`Menu: ${item.title}`);
  };
  const menuItemsWithPress = menuItems.map((item) => ({
    ...item,
    onPress: () => handleMenuPress(item),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Welcome, ${user?.kode || 'User'}`} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            Rp {user?.saldo?.toLocaleString() || '0'}
          </Text>
          <TouchableOpacity
            style={styles.topUpButton}
            onPress={handleTopUp}
            accessibilityRole="button"
            accessibilityLabel="Add Balance"
          >
            <Plus size={16} color="#2563EB" strokeWidth={2.5} style={styles.topUpIcon} />
            <Text style={styles.topUpButtonText}>Tambah Saldo</Text>
          </TouchableOpacity>
        </View>

          {loadingMenu ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <MenuList items={menuItemsWithPress} navigation={navigation} />
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorContainer: {
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: colors.background.default,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.common.gray,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.common.black,
    marginBottom: 8,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  topUpIcon: {
    marginRight: 8,
  },
  topUpButtonText: {
    color: colors.common.white,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.common.black,
  },
  menuCard: {
    flexGrow: 1,
    backgroundColor: colors.common.white,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: colors.common.black,
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: Platform.OS === 'ios' ? undefined : undefined, // Adjust for Android
    elevation: Platform.OS === 'android' ? undefined : undefined, // Adjust for iOS
    flexDirection:'column', 
   alignItems:'center'
   ,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.common.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.common.black,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  menuDescription: {
    fontSize: 14,
    color: colors.common.gray,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});


export default HomeScreen;
