
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  elements: Elements;
  card: StripeElement;
  error:string = undefined;

  numTokens:number;

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  stripeTest: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder
    , private stripeSvc: StripeService
    , private router: Router
    , private api: ApiService
    , private utils: UtilitiesService
    ) {}

  ngOnInit() {
    const navExtras = this.router.getCurrentNavigation().extras.state;
    if (navExtras) {
      this.numTokens = navExtras.numTokens;
    } else {
      this.numTokens = 200;
    }

    this.stripeTest = this.fb.group({
      name: ['', Validators.required]
    });

    const elementStyles = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
  
        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',
  
        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };

    this.stripeSvc.elements(this.elementsOptions).subscribe(elements => {
      this.elements = elements;
      if (!this.card) {
        this.card = elements.create('cardNumber', {
          style: elementStyles,
        });
        this.card.mount('#card-number');
      
        var cardExpiry = elements.create('cardExpiry', {
          style: elementStyles,
        });
        cardExpiry.mount('#card-expiry');
      
        var cardCvc = elements.create('cardCvc', {
          style: elementStyles,
        });
        cardCvc.mount('#card-cvc');
        this.card.on('change', this.onCardChange)
      }
    });
  }

  onCardChange = ({error}) => {
    // debugger
    if(error){
      this.error = error?.message;
      console.log('onCardChange', error)
    } else {
      this.error = null;
    }
  }

  async buy() {
    const name = this.stripeTest.get('name').value;
    // debugger;
    await this.utils.showLoading();
    try{
      this.stripeSvc.createToken(this.card, { name }).subscribe(async result => {
        if (result.token) {
          const formData = new FormData();
          formData.append('stripeToken', result.token.id);
          formData.append('amount', 5+'');
          formData.append('userName', name);
          const paymentObs:Observable<any> = await this.api._createData('buyTokens', formData);
          const payment = await paymentObs.pipe(first()).toPromise();
          this.utils.dismissLoading();
          window.open(payment.receipt_url);
        } else if (result.error) {
          this.utils.dismissLoading();
          console.log('Error', result.error.message);
          this.error = result.error.message;
        }
      });
    } catch (error) {
      this.utils.dismissLoading();
      this.error = error.message;
    }
  }
}