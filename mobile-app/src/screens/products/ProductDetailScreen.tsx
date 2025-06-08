import React, { useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
import Header from '../../components/Header';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { transactions } from '../../services/api';
import { Product } from '../../types';

type ProductDetailScreenProps = {
  route: {
    params: {
      product: Product;
    };
  };
  navigation: any;
};

export const ProductDetailScreen = ({ route, navigation }: ProductDetailScreenProps) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await transactions.create({
        produk: product.kode,
        tujuan: phoneNumber,
        qty: parseInt(quantity),
        counter: 1,
        hpenduser: phoneNumber,
      });

      Alert.alert(
        'Success',
        'Transaction completed successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to complete transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Product Detail"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{product.nama}</Text>
          <Text style={styles.productCode}>{product.kode}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceAmount}>
            Rp {product.harga_jual1.toLocaleString()}
          </Text>
          <Text style={styles.stockInfo}>
            Available Stock: {product.jumlah_Stok_unit}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <ErrorMessage message={error} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              Rp {(product.harga_jual1 * parseInt(quantity || '0')).toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={loading}
        >
          <Text style={styles.purchaseButtonText}>
            {loading ? 'Processing...' : 'Purchase Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  productHeader: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 16,
    color: '#666666',
  },
  priceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  stockInfo: {
    fontSize: 14,
    color: '#059669',
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
  },
  totalSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  purchaseButton: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
