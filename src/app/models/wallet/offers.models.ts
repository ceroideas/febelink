export interface Asset {
    asset_type?: string
    asset_code?: string
    asset_issuer?: string
}

export interface Price {
    n: number // Numerator -> Selling
    d: number // Denominator -> Buyin
}

export interface Offer {
    _links: any
    id: string
    paging_token: string
    seller: string
    selling: Asset
    buying: Asset
    amount: string
    price_r: Price
    price: string
    last_modified_ledger: number
    last_modified_time: string
}

export enum OffersType {
  MARKET = "market",
  OWN = "own"
}

export interface OffersList {
    offers: Offer[]
    type: OffersType

    // This array is to store the last id per page to go back on prev_page (pagination)
    lastIdsPerPage: string[]

    isLoading: boolean
}

export interface OffersFilter {
    order?: 'asc' | 'desc'
    limit?: number

    last_item?: string

    /* Asset Selling */
    selling?: string
    sellingIssuerId?: string

    /* Asset Buying */
    buying?: string
    buyingIssuerId?: string

    offerId?: string

    account?: string
}