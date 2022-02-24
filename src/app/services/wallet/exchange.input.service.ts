import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { iExchangeInput, ExchangeInput } from 'src/app/models/wallet/exchange.model';
import { ToastSvc } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeInputSvc
{
    constructor(
        private toastSvc: ToastSvc
    ) {}
    
    calc( iEx: iExchangeInput, form: FormGroup ) {
        let key: string, qant: number = 0

        switch( iEx.is ) {
            case ExchangeInput.SELL_QANT:
            case ExchangeInput.SELL_CONV:
                if( !this.continue( iEx.sell_qant, iEx.maxSell, 'sell', iEx.maxDecimals, form ))
                    return

                key = 'num_buy_qant'
                qant = this.do( iEx, ExchangeInput.BUY_QANT )
                break
            case ExchangeInput.BUY_QANT:
            case ExchangeInput.BUY_CONV:
                if( !this.continue( iEx.buy_qant, iEx.maxBuy, 'buy', iEx.maxDecimals, form ))
                    return

                key = 'num_sell_qant'
                qant = this.do( iEx, ExchangeInput.SELL_QANT )
                break
        }
        this.update( form, key, qant, iEx.maxDecimals )
    }

    private continue(
        input: string, qant: number, key: string, maxDecimals: number, form: FormGroup
    ): boolean {
        if( !qant || Number.parseFloat( input || '0' ) <= qant )
            return true

        this.update( form, `num_${key}_qant`, qant, maxDecimals, true );
        this.toastSvc.show( `pages.wallet.exchange.exceeds-${key}`, true )
        return false;

    }

    public update( form: FormGroup, key: string, qant: number, maxDec: number, emit: boolean = false )
    {
        form.patchValue({
            [ key ]: qant == 0 ? '' : qant.toFixed( maxDec )}
            , { emitEvent: emit, onlySelf: !emit }
        )
    }

    private do( iEx: iExchangeInput, exchangeInput: ExchangeInput ): number
    {
        switch( exchangeInput ) {
            case ExchangeInput.SELL_QANT:
                return this.math( iEx.buy_qant
                    , iEx.sell_conv
                    , iEx.buy_conv
                    , iEx.sell_qant
                )
            case ExchangeInput.BUY_QANT:
                return this.math( iEx.sell_qant
                    , iEx.buy_conv
                    , iEx.sell_conv
                    , iEx.buy_qant
                )
        }
        return 0;
    }
    private math( opposite: string, multiplier: number, divider: number, self: string ): number
    {
        return !opposite || !multiplier || !divider ? Number.parseFloat( self || '0' )
            : Number.parseFloat( opposite )
            * multiplier
            / divider
    }
}
