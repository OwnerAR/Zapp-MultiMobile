import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import LinearGradient from 'expo-linear-gradient';
import { colors } from '../../constants/colors';


interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: string;
  onPress: () => void;
}

interface MenuListProps {
  items: MenuItem[];
  navigation: any;
}

const MenuList: React.FC<MenuListProps> = ({ items, navigation }) => {
  const handlePress = (type: string, name: string) => {
    // Ganti sesuai kebutuhan navigasi/aksi
    switch (type) {
      case 'prepaid':
        // contoh: navigate ke Products
        // navigation.navigate('Products');
        navigation.navigate('Prepaid', { name });
        break;
      case 'prepaid-pln':
        navigation.navigate('PrepaidPLN', { name });
        break;
      default:
        alert('Menu belum di-handle');
    }
  };
  return (
    <View style={styles.menuGrid}>
      {items.map(({ id, title, description, icon, type }) => {
        // Mapping nama icon ke komponen Lucide, fallback ke Circle jika tidak ditemukan
        const IconComponent =
          LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Circle;

        return (
          <TouchableOpacity
            key={id}
            style={styles.menuCard}
            onPress={() => handlePress(type, title)}
            accessibilityRole="button"
            accessibilityLabel={title}
          >
            <View style={styles.menuIconGradient}>
              <IconComponent size={28} color="#fff" />
            </View>
            <Text style={styles.menuTitle}>{title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menuGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  menuCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: colors.common.white,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 110,
  },
  menuIconWrapper: {
    marginBottom: 12,
  },
  menuIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary.main, // fallback untuk web
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  menuDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default MenuList;
