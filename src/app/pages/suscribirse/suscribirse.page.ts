import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from 'src/app/services/api.service';
import {UtilitiesService} from 'src/app/services/utilities.service';
import {StripeService, Elements, Element as StripeElement, ElementsOptions} from "ngx-stripe";
import {ModalController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Subscription } from 'src/app/models/subscription';


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
    subscription: Subscription[];
    selected:number;
    clicked: any = 0;
    subscriptions: Subscription[];
    perfil: any;
    subscriptionDetails:Map<string, SubscriptionDetails> = new Map();
    subscriptionChanged:boolean

    constructor(private stripeService: StripeService,
                private modalCtrl: ModalController,
                private api: ApiService,
                private utilities: UtilitiesService,
                private storage: Storage,
                private router: Router) {


    }

    myCurrentPlan = null;
    async ngOnInit() {

        this.fillSubscriptionStaticInfo();

        (await this.api.getAllSubscriptions()).subscribe((suscriptions:[]) => {
            this.subscriptions = suscriptions;
            this.utilities.getUserSubscription().then(async subscription => {
                this.subscription = subscription;
                if (this.subscription.length == 0) {
                    this.subscription = null;
                    this.myCurrentPlan = this.subscriptions.filter(s => s.price === 0)[0];
                }
                else {
                    const stripePlan = this.subscription[0].stripe_plan;
                    this.myCurrentPlan = this.subscriptions.filter(s => s.stripe_plan === stripePlan)[0];
                }
                
                this.selected = this.myCurrentPlan.id;
                // this.setupStripe();
                // console.log(this.selected);    
            });
        });

        this.utilities.getUserData().then((data) => {
            this.perfil = data;
        });
    }

    private fillSubscriptionStaticInfo() {
        const advantagesPro = [
            { title: 'Tres subsectores', description: 'Permite elegir tres subsectores dentro del mismo sector para tener más visibilidad y llegar a más clientes.' },
            { title: 'Descripción de 1000 caracteres', description: 'Cuenta todo lo que necesites sobre tu servicio sin límite de caracteres en la descripción.' },
            { title: 'Ventajas Free', description: 'Incluye todas las ventajas que puedes disfrutar en el plan free.' },
            { title: 'Recibe pagos de forma fácil', description: 'Recibe y realiza pagos con otros usuarios a través de Febelink.' },
        ];
        const advantagesFree = [
            { title: 'Publica tus búsquedas', description: 'Realiza todas las búsquedas que necesites, encuentra clientes y recomienda a otros usuarios.' },
            { title: 'Contacta con usuarios', description: 'Puedes hacer y responder ofertas sin limitaciones.' },
            { title: 'Chat y notificaciones', description: 'Habla con tus potenciales clientes todo lo que necesites y reibe notificaciones para no perderte ninguna oportunidad.' },
            { title: 'Foto o logo', description: 'Puedes poner una imagen de tu empresa o marca personal.' },
            { title: 'Descripción de 50 caracteres', description: 'Perfecta para una breve descripción sobre tu servicio' },
        ];
        this.subscriptionDetails.set('febe-pro', { description: '9,95€/mes + IVA. Sin compromiso, cancelación en cualquier momento.', advantages: advantagesPro });
        this.subscriptionDetails.set('febe-prom', { description: 'Promoción Pro + Foto/Logo por 0€/mes.', advantages: advantagesFree });
    }

    // ionViewDidLoad() {
    //     this.setupStripe();
    // }

    // setupStripe() {

    //     var style = {
    //         base: {
    //             color: '#32325d',
    //             lineHeight: '24px',
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSmoothing: 'antialiased',
    //             fontSize: '16px',
    //             '::placeholder': {
    //                 color: '#aab7c4'
    //             }
    //         },
    //         invalid: {
    //             color: '#fa755a',
    //             iconColor: '#fa755a'
    //         }
    //     };

    //     this.stripeService.elements(this.elementsOptions)
    //         .subscribe(elements => {
    //             this.elements = elements;

    //             if (!this.card) {
    //                 this.card = this.elements.create('card', {hidePostalCode: true, style: style});
    //                 this.card.mount('#card-element');
    //             }
    //         });

    //     this.card.addEventListener('change', event => {
    //         var displayError = document.getElementById('card-errors');
    //         if (event.error) {
    //             displayError.textContent = event.error.message;
    //         } else {
    //             displayError.textContent = '';
    //         }
    //     });

    //     var form = document.getElementById('payment-form');
    //     form.addEventListener('submit', event => {
    //         event.preventDefault();

    //         if (this.selected != null) {
    //             this.stripeService.createToken(this.card, {}).subscribe(async result => {
    //                 if (result.error) {
    //                     var errorElement = document.getElementById('card-errors');
    //                     errorElement.textContent = result.error.message;
    //                 } else {
    //                     this.utilities.showLoading();

    //                     (await this.api.subscribe(this.selected, result.token.id)).subscribe(async response => {

    //                         console.log(response);
    //                         await this.utilities.saveUserSubscription(response.subscription);
    //                         console.log(result.token.id);
    //                         this.card.clear();
    //                         this.subscription = await this.utilities.getUserSubscription();
    //                         this.utilities.dismissLoading();
    //                         this.utilities.showToast('Suscrito correctamente');

    //                     });

    //                 }
    //             });
    //         }
    //     });


    // }


    async openStripe(stripe_plan) {
        this.selected = stripe_plan;
        console.log(this.selected);        
    }

    public closeModal(): void {
        this.modalCtrl.dismiss({subscriptionChanged: this.subscriptionChanged});
    }

    public logout(): void {
        this.storage.remove('userData').then(() => {
            this.storage.remove('subscription').then(() => {

                this.router.navigate(['login']);
                this.utilities.showToast('Suscripción cancelada');

            })
        })
    }

    async paySubscription(idSelectedSubscription:number){
        console.log(idSelectedSubscription);
        await this.utilities.showLoading()
        const myNewPlan:Subscription = this.subscriptions.filter(s => s.id === idSelectedSubscription)[0];
        if(myNewPlan.price>0){
            try{
                const checkout = await this.api.paySubscription(idSelectedSubscription);
                console.log(checkout);
                if(checkout.externalCheckoutUrl) window.location.href = checkout.externalCheckoutUrl
                else this.utilities.showToast(checkout.message);
            } catch(e){
                console.error(e);            
            }
        } else{
            const checkout = await this.api.cancelSubscription();
            const subscriptionInfo:{subscription, subscription_details:Subscription} = await this.api.getUserSusbcription();
            await this.utilities.saveUserSubscription(subscriptionInfo.subscription);
            await this.utilities.saveUserSubscriptionDetails(subscriptionInfo.subscription_details);
            this.utilities.showToast(checkout.message);
        }
        this.subscriptionChanged = true;
        this.utilities.dismissLoading();
        this.utilities.wait(500);
        this.closeModal();
    }


    async swapSubscription(idSelectedSubscription:number) {
        this.utilities.showLoading();

        (await this.api.swapSubscription(idSelectedSubscription)).subscribe(async response => {

            await this.utilities.saveUserSubscription(response.subscription);
            this.subscription = await this.utilities.getUserSubscription();
            this.utilities.dismissLoading();
            this.utilities.showToast('Suscripción cambiada correctamente');

        });

    }

    async cancelSubscription() {
        this.utilities.showLoading();

        (await this.api.cancelSubscription()).subscribe(async response => {

            await this.utilities.saveUserSubscription(response.subscription);
            this.closeModal();
            this.utilities.dismissLoading();
            this.logout();

        });

    }

}


interface SubscriptionDetails {
    description: string;
    advantages: {title: string, description: string}[]
}