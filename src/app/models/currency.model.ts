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
