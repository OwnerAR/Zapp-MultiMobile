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
import { products } from '../../services/api';
import { Product } from '../../types';

export const ProductsScreen = ({ navigation }: any) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setError(null);
      const data = await products.getAll();
      setProductList(data);
    } catch (error) {
      setError('Failed to load products. Please try again.');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProducts().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nama}</Text>
        <Text style={styles.productCode}>{item.kode}</Text>
        <Text style={styles.productStock}>Stock: {item.jumlah_Stok_unit}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price</Text>
        <Text style={styles.priceAmount}>
          Rp {item.harga_jual1.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
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
          title="Products"
          onBack={() => navigation.goBack()}
        />
        <ErrorMessage message={error} onRetry={loadProducts} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Products"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={productList}
        renderItem={renderProduct}
        keyExtractor={(item) => item.kode}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
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
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  productCode: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 14,
    color: '#666666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
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

export default ProductsScreen;
