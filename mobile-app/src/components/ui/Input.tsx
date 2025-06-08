import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import colors from '../../constants/colors';

interface InputProps extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerStyle,
      labelStyle,
      inputContainerStyle,
      inputStyle,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, labelStyle]} numberOfLines={1}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            inputContainerStyle,
            error && styles.inputContainerError,
            disabled && styles.inputContainerDisabled,
          ]}
        >
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[styles.input, inputStyle]}
            placeholderTextColor={colors.gray[400]}
            editable={!disabled}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          {error && (
            <View style={styles.errorIcon}>
              <AlertCircle size={16} color={colors.status.error.main} />
            </View>
          )}
        </View>
        {error && (
          <Text style={styles.errorText} numberOfLines={2}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,
  },
  errorIcon: {
    paddingRight: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error.main,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default Input;
