import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import colors from '../../constants/colors';

interface CurrencyInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  value: string;
  onChangeText: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  prefix?: string;
}

export const CurrencyInput = React.forwardRef<TextInput, CurrencyInputProps>(
  ({ 
    label, 
    error, 
    value, 
    onChangeText, 
    containerStyle,
    prefix = 'Rp',
    style,
    ...props 
  }, ref) => {
    const handleChangeText = (text: string) => {
      // Remove non-numeric characters
      const numericValue = text.replace(/[^0-9]/g, '');
      onChangeText(numericValue);
    };

    const formattedValue = value ? parseInt(value).toLocaleString() : '';

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[
          styles.inputContainer,
          error ? styles.inputContainerError : undefined,
          props.editable === false ? styles.inputContainerDisabled : undefined,
        ]}>
          <Text style={styles.prefix}>{prefix}</Text>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            value={formattedValue}
            onChangeText={handleChangeText}
            keyboardType="numeric"
            placeholderTextColor={colors.gray[400]}
            {...props}
          />
        </View>
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={16} color={colors.status.error.main} strokeWidth={2} style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 8,
    minHeight: 44,
  },
  inputContainerError: {
    borderColor: colors.status.error.main,
    backgroundColor: colors.status.error.light,
  },
  inputContainerDisabled: {
    backgroundColor: colors.gray[100],
    borderColor: colors.border.default,
  },
  prefix: {
    paddingLeft: 12,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error.main,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default CurrencyInput;
