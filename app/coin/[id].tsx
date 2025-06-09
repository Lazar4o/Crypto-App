import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { fetchCoinDetails } from '@/services/api';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react-native';
import PriceMetricItem from '@/components/PriceMetricItem';
import moment from 'moment';
import { CoinDetail } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectCoinDetail, setCoinDetail } from '@/store/slices/coinsSlice';

export default function CoinDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const coinDetail = useSelector((state) => selectCoinDetail(state, id as string));

  useEffect(() => {
    async function loadCoinDetails() {
      if (!id) return;
      
      // If we have cached data, use it immediately
      if (coinDetail) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCoinDetails(id as string);
        dispatch(setCoinDetail(data));
      } catch (err) {
        setError('Failed to load coin details. Please try again.');
        console.error('Error fetching coin details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCoinDetails();
  }, [id, coinDetail, dispatch]);

  const handleOpenCoinGecko = () => {
    if (coinDetail) {
      Linking.openURL(`https://www.coingecko.com/en/coins/${coinDetail.id}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading coin details...
        </Text>
      </View>
    );
  }

  if (error || !coinDetail) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error || 'Failed to load coin details'}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const priceChangeColor = 
    coinDetail.market_data.price_change_percentage_24h >= 0
      ? colors.success
      : colors.error;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.coinHeader}>
            <Image
              source={{ uri: coinDetail.image.large }}
              style={styles.coinImage}
            />
            <Text style={[styles.coinName, { color: colors.text }]}>
              {coinDetail.name}
            </Text>
            <Text style={[styles.coinSymbol, { color: colors.textSecondary }]}>
              {coinDetail.symbol.toUpperCase()}
            </Text>
            
            <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.rankText, { color: colors.background }]}>
                Rank #{coinDetail.market_cap_rank}
              </Text>
            </View>
            
            <Text style={[styles.price, { color: colors.text }]}>
              ${coinDetail.market_data.current_price.usd.toLocaleString()}
            </Text>
            
            <View style={styles.priceChangeContainer}>
              <View style={styles.priceChangeRow}>
                {coinDetail.market_data.price_change_percentage_24h >= 0 ? (
                  <TrendingUp size={20} color={colors.success} />
                ) : (
                  <TrendingDown size={20} color={colors.error} />
                )}
                <Text style={[styles.priceChange, { color: priceChangeColor }]}>
                  {coinDetail.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
                </Text>
              </View>
              <Text style={[styles.priceChangeAbsolute, { color: priceChangeColor }]}>
                ${Math.abs(coinDetail.market_data.price_change_24h).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={[styles.metricsContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Price Metrics
            </Text>
            
            <View style={styles.metricsGrid}>
              <PriceMetricItem 
                label="24h High" 
                value={`$${coinDetail.market_data.high_24h.usd.toLocaleString()}`} 
              />
              <PriceMetricItem 
                label="24h Low" 
                value={`$${coinDetail.market_data.low_24h.usd.toLocaleString()}`} 
              />
              <PriceMetricItem 
                label="All Time High" 
                value={`$${coinDetail.market_data.ath.usd.toLocaleString()}`} 
                subValue={`${moment(coinDetail.market_data.ath_date.usd).format('MMM D, YYYY')}`}
              />
              <PriceMetricItem 
                label="All Time Low" 
                value={`$${coinDetail.market_data.atl.usd.toLocaleString()}`} 
                subValue={`${moment(coinDetail.market_data.atl_date.usd).format('MMM D, YYYY')}`}
              />
              <PriceMetricItem 
                label="Market Cap" 
                value={`$${coinDetail.market_data.market_cap.usd.toLocaleString()}`} 
              />
              <PriceMetricItem 
                label="Circulating Supply" 
                value={coinDetail.market_data.circulating_supply.toLocaleString()} 
              />
              <PriceMetricItem 
                label="Max Supply" 
                value={coinDetail.market_data.max_supply 
                  ? coinDetail.market_data.max_supply.toLocaleString() 
                  : 'Unlimited'} 
              />
              <PriceMetricItem 
                label="Total Volume" 
                value={`$${coinDetail.market_data.total_volume.usd.toLocaleString()}`} 
              />
            </View>
          </View>

          {coinDetail.description.en && (
            <View style={[styles.descriptionContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About {coinDetail.name}
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {coinDetail.description.en.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.coingeckoButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenCoinGecko}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              View on CoinGecko
            </Text>
            <ExternalLink size={18} color={colors.background} style={styles.buttonIcon} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  coinHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coinImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  coinName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  coinSymbol: {
    fontSize: 18,
    marginBottom: 16,
  },
  rankBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  priceChangeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceChange: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 6,
  },
  priceChangeAbsolute: {
    fontSize: 16,
  },
  metricsContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  coingeckoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});