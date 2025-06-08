import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header = ({ title, onBack, rightComponent }: HeaderProps) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000000',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  rightContainer: {
    marginLeft: 8,
  },
});

export default Header;
