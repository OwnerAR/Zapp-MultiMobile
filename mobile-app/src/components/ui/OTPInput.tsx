import React, { useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import colors from '../../constants/colors';

interface OTPInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  containerStyle?: StyleProp<ViewStyle>;
  error?: boolean;
}

export const OTPInput = React.forwardRef<any, OTPInputProps>(
  ({ value, onChange, length = 6, containerStyle, error }, ref) => {
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Forward the refs array to parent if needed
    React.useImperativeHandle(ref, () => inputRefs.current);

    const handleChange = (text: string, index: number) => {
      if (text.length > 1) {
        text = text[0];
      }

      const newValue = [...value];
      newValue[index] = text;
      onChange(newValue);

      // Move to next input if value is entered
      if (text !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      // Move to previous input on backspace
      else if (text === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && value[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {Array(length)
          .fill(0)
          .map((_, index) => (
            <TextInput
              key={index}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              style={[
                styles.input,
                error && styles.inputError,
                value[index] && styles.inputFilled,
                value.some(v => v !== '') && !value[index] && styles.inputActive,
              ]}
              value={value[index]}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`OTP digit ${index + 1} input`}
            />
          ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  input: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text.primary,
    backgroundColor: colors.common.white,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.status.error.main,
    backgroundColor: colors.status.error.light,
    borderWidth: 2,
  },
  inputFilled: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.lighter,
    borderWidth: 2,
  },
  inputActive: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
});

export default OTPInput;
