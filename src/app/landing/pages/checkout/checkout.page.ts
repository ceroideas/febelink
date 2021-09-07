
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  StripeService,
  Elements,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  elements: Elements;
  card: StripeElement;
  error:string = undefined;

  numTokens:number = 200;

  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  stripeTest: FormGroup;

  constructor(private fb: FormBuilder, private stripeSvc: StripeService) {}

  ngOnInit() {
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

  buy() {
    const name = this.stripeTest.get('name').value;
    debugger;
    this.stripeSvc.createToken(this.card, { name }).subscribe(result => {
      if (result.token) {
        console.log('Token', result.token);
      } else if (result.error) {
        console.log('Error', result.error.message);
        this.error = result.error.message;
      }
    });
  }
}