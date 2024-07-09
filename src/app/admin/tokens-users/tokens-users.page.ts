import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TokensUsersService } from '../../admin/services/tokens-users.service';
import { CryptoCurrency } from '../../models/wallet/currency.model';
import { DateFormatType } from '../../pipes/date-format.pipe';
import { AlertSvc } from '../../services/alert.service';
import { ClipboardSvc } from '../../services/clipboard.service';
import { LoadingSvc } from '../../services/loading.service';
import { ToastSvc } from '../../services/toast.service';
import { TranslateConfigService } from '../../services/translate/translate-config.service';
import { UtilitiesService } from '../../services/utilities.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { TokenCRUD, TokenPhase, TokensUser } from '../models/tokens-user';
import { EditTokensComponent } from './edit-tokens/edit-tokens.component';
import { Location } from '@angular/common'


@Component({
  selector: 'app-tokens-users',
  templateUrl: './tokens-users.page.html',
  styleUrls: ['./tokens-users.page.scss'],
  host: {ngSkipHydration: 'true'},
})
export class TokensUsersPage implements OnInit {

  isLoading: boolean = false;
  dateFormatType = DateFormatType;

  constructor(
      private tokensUsersSvc:TokensUsersService
    , public modalCtrl:ModalController
    , public clipboardSvc: ClipboardSvc
    , public alertSvc: AlertSvc
    , public toastSvc: ToastSvc
    , public loadingSvc: LoadingSvc
    , private translateSvc: TranslateConfigService
    , private walletSvc: WalletService,
    private location: Location,
    ) { }

  tokensUsers:TokensUser[] | undefined
  tkPhases: TokenPhase[] | undefined

  async ngOnInit() {
    this.search();
  }


  /**
   * Close modal
   */
  public goBack(): void {
    this.location.back();
  }
  filter:string = "";
  async search(event?: any) {
    this.isLoading = true;
    this.filter = event?.target?.value || this.filter || '';

    // this.tokensUsersSvc.getTokensUsers( this.activePage, this.filter).then(async (response: any) => {
    //   this.tokensUsers = response.items;
    //   this.tkPhases = response.tkPhases;
    //   this.totalRecords = response.totalRecords;
    //   this.recordsPerPage = response.limit;
    //   this.qPages = response.qPages;
    //   this.isLoading = false;
    // })

   
  }

  async create() {
    // if( this.isLoading ) { this.showToastLoading(); return; }

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
      this.alertSvc.show({
        title: 'admin.tokensUsers.obs',
        msg: tokensUser.observations
      }, true );
  }

  async showBalance( tokensUser: TokensUser ) {
    if( tokensUser.public == null ) {
      this.toastSvc.show( 'El usuario no tiene clave publica para ver el balance' );
      return;
    }

    // ToDo: Extract to Component
    await this.loadingSvc.show();
    const balance: { data: CryptoCurrency[] } =
        await ( await this.walletSvc.getBalanceByUserId( tokensUser.uid )).toPromise();
    await this.loadingSvc.dismiss();

    let assets: string = '';
    balance.data.forEach(( crypto, index ) => {
      assets += ( assets === '' ? '' : '<br><br>' ) +
        'Asset: ' + crypto.currency + '<br>' +
        'Cant: ' +crypto.amount ;
    });
    this.alertSvc.show({ title: 'Balance de ' + ( tokensUser.name || tokensUser.nick ), msg: assets });
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
      if( !await this.alertSvc.confirm({
          title: 'admin.tokensUsers.modal.header',
          titleParams: { CRUD: this.translateSvc.instant( TokenCRUD.Delete )},
          msg: 'admin.tokensUsers.modal.body',
          msgParams: {
            CRUD: this.translateSvc.instant( TokenCRUD.Delete ),
            name: tokensUser?.name || tokensUser?.nick,
            extra: this.translateSvc.instant( 'admin.tokensUsers.irreversible' )
          }
        })) return;
      
      this.isLoading = true; 
      await this.loadingSvc.show();
      await this.tokensUsersSvc.deleteTokenUser(tokensUser.id);
      this.toastSvc.show( 'admin.tokensUsers.delete.done', true );
      await this.loadingSvc.dismiss();
      this.search();
    }
    catch(e){
      this.isLoading = false;
      await this.loadingSvc.dismiss();
      this.toastSvc.show( 'admin.tokensUsers.delete.error', true );
    }
  }

  showToastLoading() {
    this.toastSvc.show( 'admin.tokensUsers.loading', true );
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