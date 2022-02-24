import { TokensUser } from "src/app/admin/models/tokens-user";
import { CryptoCurrency } from "./currency.model";

export interface WalletParams {
    userWallets?: CryptoCurrency[]
    publicKey?: string
    retainedTks?: TokensUser[]
    verified?: { account: boolean, mandatory: boolean, kyc: boolean }
    minnersFee?: string
    stripeFee?: string
    assetsMaxDecimals?: number
}