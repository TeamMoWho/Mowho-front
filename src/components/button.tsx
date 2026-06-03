import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          variant === 'secondary' && styles.secondaryText,
        ]}
      >
        {loading ? '로딩중...' : title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#E5E5EA',
  },
  danger: {
    backgroundColor: '#FF3B30',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryText: {
    color: '#000',
  },
});
