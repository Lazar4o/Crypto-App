import { Coin, CoinDetail } from '@/types';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const COIN_IDS = [
  'bitcoin',
  'ethereum',
  'solana',
  'dogecoin',
  'cardano',
  'ripple',
  'polkadot',
  'tron',
  'litecoin',
  'chainlink'
].join(',');

export async function fetchCoins(): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}

export async function fetchCoinDetails(id: string): Promise<CoinDetail> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
}