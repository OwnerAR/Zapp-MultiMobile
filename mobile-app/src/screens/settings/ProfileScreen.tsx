import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import colors from '../../constants/colors';

interface UserProfile {
  name: string;
  kode: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
}

export const ProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setProfile(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const ProfileItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.profileItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Profile Details" 
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.kode}>{profile.kode}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <ProfileItem 
              label="Email"
              value={profile.email || '-'}
            />
            <ProfileItem 
              label="Phone"
              value={profile.phone || '-'}
            />
            <ProfileItem 
              label="Address"
              value={profile.address || '-'}
            />
            <ProfileItem 
              label="Balance"
              value={`Rp ${profile.balance?.toLocaleString() || '0'}`}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  kode: {
    fontSize: 16,
    color: colors.text.secondary,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  section: {
    padding: 16,
  },
  sectionContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  label: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  value: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default ProfileScreen;
