import { Injectable } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IUser } from 'src/app/models/user.model';
import { IAssistant, IKeywords } from '../models/assistant.model';
import { AssistantPopComponent } from '../pop/pop.component';

@Injectable({
  providedIn: 'root'
})
export class AssistantPopSvc
{
  constructor(
      private popCtrl: PopoverController
  ) {}

  async show( perfil: IUser, iKeywords: IKeywords ): Promise<IAssistant>
  {
    const popover = await this.popCtrl.create({
      component: AssistantPopComponent,
      translucent: true,
      backdropDismiss: false, // To prevent user cancel on touch outside by error
      mode: 'md',
      componentProps: {
        iKeywords: iKeywords,
        searchText: iKeywords?.searchText,

        id_sector: iKeywords?.main?.sector_id,
        sector: iKeywords?.main?.sector_nombre,

        id_subsector: iKeywords?.main?.subsector_id,
        subsector: iKeywords?.main?.subsector_nombre,

        perfil: perfil
      },
      cssClass: 'pop-h-80 pop-w-700',
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if( !data )
      return;
    
    return data;
  }
}
