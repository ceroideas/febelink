import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-suscribirse',
  templateUrl: './suscribirse.page.html',
  styleUrls: ['./suscribirse.page.scss'],
})
export class SuscribirsePage implements OnInit {

  elements: Elements;
  // optional parameters
  elementsOptions: ElementsOptions = {
    locale: 'es'
  };

  card: any;
  subscription: any;
  selected: any = null;
  clicked: any = 0;
  subscriptions: any[];

  constructor( private stripeService: StripeService,
               private modalCtrl: ModalController,
               private api: ApiService,
               private utilities: UtilitiesService,
               private storage: Storage,
               private router: Router ) {


   }

  async ngOnInit() {

    (await this.api.getAllSubscriptions()).subscribe( suscriptions => {

     
      this.subscriptions = suscriptions;

      this.utilities.getUserSubscription().then(async subscription => {
       
        this.subscription = subscription;
        if (this.subscription.length == 0) {
          this.subscription = null;
          this.selected = 1;//NEW
        }
        
        console.log(this.subscription);
        if (this.subscription != null) {
          this.selected = this.subscription[0].stripe_plan;
        }

        this.setupStripe();

      });
    });

  }

  ionViewDidLoad() {
   // this.setupStripe();
  }

  setupStripe(){

    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        
        if (!this.card) {
          this.card = this.elements.create('card', { hidePostalCode: true, style: style });
          this.card.mount('#card-element');
        }
      });

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();

      if (this.selected != null) {
        this.stripeService.createToken(this.card,{}).subscribe(async result => {
          if (result.error) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            this.utilities.showLoading();

            (await this.api.subscribe(this.selected, result.token.id)).subscribe( async response => {

              console.log(response);
              await this.utilities.saveUserSubscription(response.subscription);
              console.log(result.token.id);
              this.card.clear();
              this.subscription = await this.utilities.getUserSubscription();
              this.utilities.dismissLoading();
              this.utilities.showToast('Suscrito correctamente');

            });

          }
        }); 
      }
    });


  }
 

  async openStripe(stripe_plan) {
    this.selected = stripe_plan;
  }

  public closeModal():void {
    this.modalCtrl.dismiss();
  }

  public logout(): void {
    this.storage.remove('userData').then(() => {
      this.storage.remove('subscription').then(() => {

        this.router.navigate(['login']);
        this.utilities.showToast('Suscripción cancelada');
       
      })
    })
  }


  async swapSubscription(stripe_plan) {
    this.utilities.showLoading();

    (await this.api.swapSubscription(stripe_plan)).subscribe(async response => {

      await this.utilities.saveUserSubscription(response.subscription);
      this.subscription = await this.utilities.getUserSubscription();
      this.utilities.dismissLoading();
      this.utilities.showToast('Suscripción cambiada correctamente');
      
    });

  }

  async cancelSubscription() {
    this.utilities.showLoading();

    (await this.api.cancelSubscription()).subscribe( async response => {

      await this.utilities.saveUserSubscription(response.subscription);
      this.closeModal();
      this.utilities.dismissLoading();
      this.logout();

    });
    
  }

}
