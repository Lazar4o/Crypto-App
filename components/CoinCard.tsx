import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Coin } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface CoinCardProps {
  coin: Coin;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const router = useRouter();
  const { colors } = useTheme();
  
  const isPriceUp = coin.price_change_percentage_24h >= 0;
  const priceChangeColor = isPriceUp ? colors.success : colors.error;
  
  const handlePress = () => {
    router.push(`/coin/${coin.id}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: coin.image }}
          style={styles.image}
        />
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, { color: colors.textSecondary }]}>
            #{coin.market_cap_rank}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text 
          style={[styles.symbol, { color: colors.text }]}
          numberOfLines={1}
        >
          {coin.symbol.toUpperCase()}
        </Text>
        <Text 
          style={[styles.name, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {coin.name}
        </Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: colors.text }]}>
          ${coin.current_price.toLocaleString()}
        </Text>
        
        <View style={[styles.changeContainer, { backgroundColor: isPriceUp ? colors.successLight : colors.errorLight }]}>
          {isPriceUp ? (
            <TrendingUp size={14} color={colors.success} />
          ) : (
            <TrendingDown size={14} color={colors.error} />
          )}
          <Text style={[styles.change, { color: priceChangeColor }]}>
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    marginBottom: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
  },
  priceContainer: {
    marginTop: 'auto',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});