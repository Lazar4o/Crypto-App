import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { fetchCoins } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import CoinCard from '@/components/CoinCard';
import { Coin } from '@/types';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MarketScreen() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const loadCoins = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCoins();
      setCoins(data);
    } catch (err) {
      setError('Failed to load cryptocurrency data. Please try again.');
      console.error('Error fetching coins:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCoins();
  }, [loadCoins]);

  useEffect(() => {
    loadCoins();

    // Set up polling for live updates
    const interval = setInterval(() => {
      if (isFocused) {
        loadCoins();
      }
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [loadCoins, isFocused]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading cryptocurrency data...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={coins}
          renderItem={({ item }) => <CoinCard coin={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Top 10 Cryptocurrencies
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Live market data from CoinGecko
              </Text>
              <Text style={[styles.updateText, { color: colors.textSecondary }]}>
                Last updated: {new Date().toLocaleTimeString()}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    padding: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  updateText: {
    fontSize: 12,
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});