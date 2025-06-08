import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import colors from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { useAuth } from '../../store/AuthStore';

export const SettingsScreen = ({ navigation }: any) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isBiometricEnabled, setIsBiometricEnabled] = React.useState(false);
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const SettingItem = ({ 
    title, 
    description, 
    isSwitch = false,
    value = false,
    onValueChange,
    onPress,
  }: {
    title: string;
    description?: string;
    isSwitch?: boolean;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={isSwitch}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.gray[300], true: colors.primary.light }}
          thumbColor={value ? colors.primary.main : colors.common.white}
        />
      ) : (
        <Text style={styles.settingArrow}>→</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Profile Details"
              description="View and manage your account information"
              onPress={() => navigation.navigate('Profile')}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Dark Mode"
              description="Switch between light and dark themes"
              isSwitch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Push Notifications"
              description="Receive updates and alerts"
              isSwitch
              value={isNotificationsEnabled}
              onValueChange={setIsNotificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Biometric Authentication"
              description="Use fingerprint or face recognition"
              isSwitch
              value={isBiometricEnabled}
              onValueChange={setIsBiometricEnabled}
            />
            <SettingItem
              title="Change PIN"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Privacy Policy"
              onPress={() => {}}
            />
            <SettingItem
              title="Terms of Service"
              onPress={() => {}}
            />
            <SettingItem
              title="App Version"
              description="1.0.0"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  sectionContent: {
    backgroundColor: colors.common.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  settingArrow: {
    fontSize: 18,
    color: colors.gray[400],
    marginLeft: 8,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.status.error.light,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.status.error.main,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default SettingsScreen;
