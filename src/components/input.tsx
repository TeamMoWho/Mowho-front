import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { ThemedText } from './themed-text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  helperText?: string;
}

export const Input = ({
  label,
  error,
  containerStyle,
  helperText,
  ...props
}: InputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
      {helperText && !error && (
        <ThemedText style={styles.helper}>{helperText}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  helper: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});
