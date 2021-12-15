export enum CryptoCurrencyType {
  aureo = 'FLAU',
  lumens = 'XLM',
  euro = 'EUR',
  uSDolar = 'USD',
  bitcoin = 'BTC',
}

export interface CryptoCurrency {
  currency: CryptoCurrencyType;
  ammount: number;
}

export const CryptoCurrencyTypes: CryptoCurrency[] = [
  { currency: CryptoCurrencyType.aureo,  ammount: 0 },
  { currency: CryptoCurrencyType.lumens,  ammount: 0 },
  { currency: CryptoCurrencyType.euro,  ammount: 0 },
  { currency: CryptoCurrencyType.uSDolar,  ammount: 0 },
  { currency: CryptoCurrencyType.bitcoin,  ammount: 0 }
];
