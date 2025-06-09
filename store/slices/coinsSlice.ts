import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoinDetail } from '@/types';

interface CoinsState {
  coinDetails: Record<string, CoinDetail>;
  lastFetched: Record<string, number>;
}

const initialState: CoinsState = {
  coinDetails: {},
  lastFetched: {},
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoinDetail: (state, action: PayloadAction<CoinDetail>) => {
      state.coinDetails[action.payload.id] = action.payload;
      state.lastFetched[action.payload.id] = Date.now();
    },
  },
});

export const { setCoinDetail } = coinsSlice.actions;

export const selectCoinDetail = (state: { coins: CoinsState }, id: string) => {
  const coinDetail = state.coins.coinDetails[id];
  const lastFetched = state.coins.lastFetched[id];
  
  if (!coinDetail || !lastFetched) return null;
  
  const isStale = Date.now() - lastFetched > CACHE_DURATION;
  return isStale ? null : coinDetail;
};

export default coinsSlice.reducer;