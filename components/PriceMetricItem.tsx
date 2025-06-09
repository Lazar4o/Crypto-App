import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface PriceMetricItemProps {
  label: string;
  value: string;
  subValue?: string;
}

export default function PriceMetricItem({ label, value, subValue }: PriceMetricItemProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
      {subValue && (
        <Text style={[styles.subValue, { color: colors.textSecondary }]}>
          {subValue}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subValue: {
    fontSize: 12,
  },
});