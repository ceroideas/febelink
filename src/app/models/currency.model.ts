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
  assetId?: string;
  priceBuy?: number;
}

export const AssetTypes: CryptoCurrency[] = [
  { currency: CryptoCurrencyType.aureo,  amount: 0, assetId: 'FBLINKCOINV3' },
  { currency: CryptoCurrencyType.lumens,  amount: 0, assetId: 'XLM' },
  { currency: CryptoCurrencyType.euro,  amount: 0 },
  { currency: CryptoCurrencyType.uSDolar,  amount: 0 },
  { currency: CryptoCurrencyType.bitcoin,  amount: 0 }
];

export interface CryptoTransactions {
    offers: { records: CryptoOffers[] }
  , operations: { records: CryptoOperations[] }
  , payments: { records: CryptoOperations[] }
  , traders: { records: CryptoOperations[] }
}

export interface CryptoOffers {
  amount: string
  buying: any
  id: string
  last_modified_ledger: number
  last_modified_time: string
  paging_token: string
  price: string
  price_r: any
  seller: string
  selling: any
  _links: any
}

export interface CryptoOperations {
  created_at: string
  id: string
  paging_token: string
  transaction_hash: string
  transaction_successful: boolean
  type: string
  type_i: number
  
  // Creation
  account: string
  funder: string
  source_account: string
  starting_balance: string

  // Selling
  amount: number // Buying ammount
  buying_asset_type: string
  offer_id: string
  price: number
  price_r: { n: number, d: number }
  selling_asset_code: string
  selling_asset_issuer: string
  selling_asset_type: string
}

export enum CryptoOpType {
  // https://stellar-docs.overcat.me/horizon/reference/resources/operation.html
  // https://developers.stellar.org/docs/start/list-of-operations
  CREATE_ACCOUNT = 0, // Creates a new account in Stellar network.
  PAYMENT = 1, // Sends a simple payment between two accounts in Stellar network.
  PATH_PAYMENT = 2, // Sends a path payment between two accounts in the Stellar network.
  MANAGE_OFFER = 3, //	Creates, updates or deletes an offer in the Stellar network.
  CREATE_PASSIVE_OFFER = 4, //Creates an offer that won’t consume a counter offer that exactly matches this offer.
  SET_OPTIONS = 5, //	Sets account options (inflation destination, adding signers, etc.)
  CHANGE_TRUST = 6, // Creates, updates or deletes a trust line.
  ALLOW_TRUST = 7, // Updates the “authorized” flag of an existing trust line this is called by the issuer of the related asset.
  ACCOUNT_MERGE = 8, //	Deletes account and transfers remaining balance to destination account.
  INFLATION = 9, //	Runs inflation.
  MANAGE_DATA = 10, // Set, modify or delete a Data Entry (name/value pair) for an account.
  BUMP_SEQUENCE = 11, // Bumps forward the sequence number of an account.
  MANAGE_BUY_OFFER = 12, //	Creates, updates, or deletes an offer to buy one asset for another, otherwise known as a “bid” order on a traditional orderbook.
}