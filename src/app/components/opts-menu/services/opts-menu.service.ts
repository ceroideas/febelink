import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IOptsMenuButton } from './../models/opts-menu.model';
import { OptsMenuComponent } from './../opts-menu.component';

@Injectable({
  providedIn: 'root',
})
export class OptsMenuSvc {

    constructor(
        private popCtrl: PopoverController
    ) {}

    async show( event: any, iOptsMenuButtons: IOptsMenuButton[], title?: string )
    {
        const popover = await this.popCtrl.create({
            event: event,
            component: OptsMenuComponent,
            componentProps:{
                buttons: iOptsMenuButtons
                , title: title
            },
            // translucent: true,
            mode: 'md',
            // cssClass: 'pop-yt',
            // backdropDismiss: false // To prevent user cancel on touch outside by error
        });
    
        await popover.present();
    }
}
