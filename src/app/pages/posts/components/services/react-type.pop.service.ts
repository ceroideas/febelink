import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IReactTypes } from '../models/react-types.model';
import { ReactTypesComponent } from '../react-types/react-types.component';

@Injectable({
  providedIn: 'root',
})
export class ReactTypePopSvc
{
    constructor(
        private popCtrl: PopoverController
    ) {}

    async show( ev: any ): Promise<IReactTypes>
    {
        const popover = await this.popCtrl.create({
          component: ReactTypesComponent,
          event: ev,
          translucent: true,
          mode: 'md',
        });
    
        await popover.present();
    
        const { data } = await popover.onDidDismiss();
        console.log( data )
    
        if( !data )
          return;
        
        return data;
      }
}
