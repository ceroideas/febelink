import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Button, InformComponent } from '../components/inform/inform.component';

export interface iInform {
    title?: string
    image?: string
    showImage?: boolean

    pompadour?: string
    showPompadour?: boolean
    
    subtitle?: string
    showSubtitle?: boolean
  
    description?: string
    
    // IF null => wont show || if true => '' || if false => 
    showCheckmark?: boolean
    checkmark?: string
  
    buttons?: Button[]
    OnClick?: ( button: Button ) => any
}

@Injectable({
  providedIn: 'root',
})
export class InformSvc {

    constructor(
        private modalCtrl: ModalController
    ) {}

    async show( params: iInform ) {
        const exchangeModal = await this.modalCtrl.create({
                component: InformComponent,
                componentProps:{
                    title: params?.title

                    , image: params?.image || 'assets/landing/logo-dark.png'
                    , showImage: params?.showImage || true
                    
                    , pompadour: params?.pompadour
                    , showPompadour: params?.showPompadour || true
                    
                    , subtitle: params?.subtitle
                    , showSubtitle: params?.showSubtitle || true

                    , description: params?.description
                    
                    // IF null => wont show || if true => '' || if false => 
                    , showCheckmark: params?.showCheckmark
                    , checkmark: params?.checkmark

                    , buttons: params?.buttons
                    , OnClick: params?.OnClick
                }
                , cssClass: 'pop-w-300 pop-h-400 pop-opacity pop-br-10'
            });

        await exchangeModal.present();
    }
}
