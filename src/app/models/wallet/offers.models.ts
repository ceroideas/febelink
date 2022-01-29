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