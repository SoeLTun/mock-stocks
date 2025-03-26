/** Constant representing the 'All' tag. */
export const TAG_ALL = 'All';

/** Interface defining stock data. */
export interface Stock {
  id: string;
  symbol: string;
  name?: string;
  lastPrice?: number;
  marketCap?: number;
  tag?: string; // Could be multiple values
}

/** Interface defining tag data. */
export interface Tag {
  id: string;
  name: string;
}

/** Interface defining stock detail item display. */
export interface StockDetailsItem {
  label: string;
  key: keyof Stock;
}
