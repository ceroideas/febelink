export enum ExchangeType {
    CREATE = 'create'
  , MARKET = 'market' // Use Market Price on Create
  , EDIT = 'edit'
  , BUY = 'purchase'
  , DELETE = 'delete'
}

export enum ExchangeInput {
    SELL_QANT = 'sell_qant'
  , SELL_CONV = 'sell_conversion'
  , BUY_QANT  = 'buy_qant'
  , BUY_CONV  = 'buy_conversion'
}

export interface iExchangeInput {
    sell_qant: string
  , sell_conv: string
  , buy_qant: string
  , buy_conv: string
  
  , is: ExchangeInput
  , maxDecimals: number

  , limitSell?: number
  , limitBuy?: number

  // If Buying, there is a limit
  , maxSell?: number
  , maxBuy?: number
}