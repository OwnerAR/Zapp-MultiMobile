import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/auth/LoginScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import HomeScreen from '../screens/home/HomeScreen';
import LoadingScreen from '../components/LoadingScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import { Product } from '../types';

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: { kode: string };
  Home: undefined;
  Products: undefined;
  ProductDetail: { product: Product };
  Transactions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
