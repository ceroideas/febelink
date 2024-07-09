import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IAdviseFilter } from '../../../pages/posts/advises/models/advises.model';
import { UserFilterComponent } from '../filter/filter.component';
import { IUserItem } from '../models/user-item.model';

@Injectable({
  providedIn: 'root',
})
export class UserFilterPopSvc {

    constructor(
        private modalCtrl: ModalController
    ) {}

    async show( urlPath?: string, params?: IAdviseFilter ): Promise<IUserItem>
    {
        const popover = await this.modalCtrl.create({
          component: UserFilterComponent,
          componentProps:{
            urlPath: urlPath
            , params: params
          },
          mode: 'md',
          cssClass: 'pop-w-300 pop-h-400 pop-opacity pop-br-10',
          backdropDismiss: false // To prevent user cancel on touch outside by error
        });
    
        await popover.present();
    
        const { data } = await popover.onDidDismiss();
        return new Promise( resolve => { resolve( data?.iUser ) });
    }
}
