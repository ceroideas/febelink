export enum CryptoCurrencyType {
  aureo = 'FLAU',
  lumens = 'XLM',
  euro = 'EUR',
  uSDolar = 'USD',
  bitcoin = 'BTC',
}

export interface CryptoCurrency {
  currency?: CryptoCurrencyType;
  amount?: number;
}

export const AssetTypes: CryptoCurrency[] = [
  { currency: CryptoCurrencyType.aureo,  amount: 0 },
  { currency: CryptoCurrencyType.lumens,  amount: 0 },
  { currency: CryptoCurrencyType.euro,  amount: 0 },
  { currency: CryptoCurrencyType.uSDolar,  amount: 0 },
  { currency: CryptoCurrencyType.bitcoin,  amount: 0 }
];
