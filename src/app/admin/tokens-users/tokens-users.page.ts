import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TokensUsersService } from 'src/app/admin/services/tokens-users.service';
import { CryptoCurrency } from 'src/app/models/currency.model';
import { DateFormatType } from 'src/app/pipes/date-format';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { WalletService } from 'src/app/services/wallet/wallet.service';
import { TokenCRUD, TokenPhase, TokensUser } from '../models/tokens-user';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';

@Component({
  selector: 'app-tokens-users',
  templateUrl: './tokens-users.page.html',
  styleUrls: ['./tokens-users.page.scss'],
})
export class TokensUsersPage implements OnInit {

  isLoading: boolean = false;
  dateFormatType = DateFormatType;

  constructor(
      private tokensUsersSvc:TokensUsersService
    , public modalCtrl:ModalController
    , public utils:UtilitiesService
    , private translateSvc: TranslateConfigService
    , private walletSvc: WalletService
    ) { }

  tokensUsers:TokensUser[]
  tkPhases: TokenPhase[]

  async ngOnInit() {
    this.search();
  }

  filter:string;
  async search(event?: any) {
    this.isLoading = true;
    this.filter = event?.target?.value || this.filter || '';
    const response = await this.tokensUsersSvc.getTokensUsers( this.activePage, this.filter );
    this.tokensUsers = response.items;
    this.tkPhases = response.tkPhases;
    this.totalRecords = response.totalRecords;
    this.recordsPerPage = response.limit;
    this.qPages = response.qPages;
    this.isLoading = false;
  }

  async create() {
    if( this.isLoading ) { this.showToastLoading(); return; }

    const suscribirseModal = await this.modalCtrl.create({
      component: EditTokensComponent,
      componentProps:{
        tokenCRUD: TokenCRUD.Create,
        tkPhases: this.tkPhases
      }
    });
    await suscribirseModal.present();

    suscribirseModal.onDidDismiss().then(async (response) => {
      if(response?.data?.updated) this.search();
    })
  }

  async showObs( tokensUser: TokensUser ) {
    // Show Observations on click (if they exist)
    if( tokensUser?.observations )
      this.utils.showAlert(
        this.translateSvc.instant( 'admin.tokensUsers.obs' ),
        tokensUser.observations
      );
  }

  async showBalance( tokensUser: TokensUser ) {
    if( tokensUser.public == null ) {
      this.utils.showToast( 'El usuario no tiene clave publica para ver el balance' );
      return;
    }

    // ToDo: Extract to Component
    await this.utils.showLoading();
    const balance: { data: CryptoCurrency[] } =
        await ( await this.walletSvc.getBalanceByUserId( tokensUser.uid )).toPromise();
    await this.utils.dismissLoading();

    let assets: string = '';
    balance.data.forEach(( crypto, index ) => {
      assets += ( assets === '' ? '' : '<br><br>' ) +
        'Asset: ' + crypto.currency + '<br>' +
        'Cant: ' +crypto.amount ;
    });
    this.utils.showAlert( 'Balance de ' + tokensUser.name, assets );
  }

  async edit(tokensUser:TokensUser){
    if( this.isLoading ) { this.showToastLoading(); return; }

    const suscribirseModal = await this.modalCtrl.create({
      component: EditTokensComponent,
      componentProps:{
        tokensUser: {...tokensUser},
        tkPhases: this.tkPhases
      }
    });
    await suscribirseModal.present();

    suscribirseModal.onDidDismiss().then(async (response) => {
      if(response?.data?.updated) this.search();
    })
  }

  async delete(tokensUser:TokensUser){
    if( this.isLoading ) { this.showToastLoading(); return; }

    try{
      if(!await this.utils.confirm( 'admin.tokensUsers.modal', {
        CRUD: this.translateSvc.instant( TokenCRUD.Delete ),
        name: tokensUser?.name || tokensUser?.nick,
        extra: this.translateSvc.instant( 'admin.tokensUsers.irreversible' )
      })) return;
      
      this.isLoading = true; 
      await this.tokensUsersSvc.deleteTokenUser(tokensUser.id);
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.delete.done' ));
       this.search();
    }
    catch(e){
      this.isLoading = false;
      this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.delete.error' ));
    }
  }

  showToastLoading() {
    this.utils.showToast( this.translateSvc.instant( 'admin.tokensUsers.loading' ));
  }

  /* Pagination */
  totalRecords: number = 0;
  recordsPerPage: number = 1;
  qPages: number = 1;
  activePage: number = 1;
  displayActivePage( activePage:number ){  
    this.activePage = activePage;
    this.search();
  }

}