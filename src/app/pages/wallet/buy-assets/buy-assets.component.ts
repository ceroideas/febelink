import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { CryptoCurrency } from 'src/app/models/wallet/currency.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-buy-assets',
  templateUrl: './buy-assets.component.html',
  styleUrls: ['./buy-assets.component.scss'],
})
export class BuyAssetsComponent implements OnInit {
  @Input() asset: CryptoCurrency = {};
  @Input() minnersFee: number;
  @Input() stripeFee: number;
  @Input() assetsMaxDecimals: number;

  public buyForm: FormGroup;

  cash: number = 0;
  calcStripe: number = 0;
  calcSubtotal: number = 0;
  calcTotal: number = 0;
  calcAssets: number = 0;
  round: number = 2;

  // In case there is a difference between the values
  // calculated in frontend and backend, calculate
  // if dontCheckDiff = true =>
  //    if there is a difference, wont alert the user and will proceed to pay
  dontCheckDiff: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private api: ApiService,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  ionViewDidLeave() {
    this.buyForm?.reset();
  }

  buildForm() {
    this.buyForm = this.formBuilder.group({
      num_origin: new FormControl('', [Validators.required]),
      num_destiny: new FormControl('', [Validators.required]),
    });
  }

  calc(amount: string) {
    const cancelCalc = !amount || !this.asset;
    this.cash = cancelCalc ? 0 : parseFloat(amount);

    this.calcStripe =
      this.cash == 0
        ? 0
        : parseFloat(
            (this.cash - this.cash / (1 + this.stripeFee / 100)).toFixed(
              this.round
            )
          );
    this.calcSubtotal =
      this.cash == 0 ? 0 : this.cash - this.calcStripe - this.minnersFee;

    this.calcTotal = parseFloat(
      (this.cash == 0 ? 0 : this.calcSubtotal / this.asset?.priceBuy).toFixed(
        this.assetsMaxDecimals
      )
    );

    this.calcAssets = parseFloat(
      (Number(this.asset?.amount) + this.calcTotal).toFixed(
        this.assetsMaxDecimals
      )
    );
  }

  onDismiss() {
    this.modalCtrl.dismiss({});
  }

  async buy() {
    const user: IUser = await this.api.utilities.getUserData();

    try {
      const formData = new FormData();

      for (var key in user) formData.append(key, user[key]);

      formData.append('cash', this.cash + '');
      formData.append('priceBuy', this.asset?.priceBuy + '');
      formData.append('subtotal', this.calcSubtotal + '');
      formData.append('stripe', this.calcStripe + '');
      formData.append('qTokens', this.calcTotal + '');

      formData.append('stripeFee', this.stripeFee + '');
      formData.append('minnersFee', this.minnersFee + '');
      formData.append('assetId', this.asset?.assetId);

      formData.append('dontCheckDiff', this.dontCheckDiff ? '1' : '0');
      // Reset for next purchase control
      this.dontCheckDiff = false;

      this.api.utilities.showLoading();
      const responseObs: Observable<any> = await this.api._createData(
        'wallet/buyTokens',
        formData
      );
      const res = await responseObs.pipe(first()).toPromise();
      this.api.utilities.dismissLoading();

      if (!res.success) {
        let errorMsg = res.message;

        // Difference in totals between frontend and backend calculations
        if (res.hasDiff) {
          this.api.utilities.showAlert(null, errorMsg, null, [
            // Cancel the Purchase
            {
              text: this.api.translateSvc.instant('common.buttons.cancel'),
              role: 'cancel',
            },
            {
              // Do the Purchase
              text: this.api.translateSvc.instant('pages.wallet.buy.button'),
              handler: () => {
                this.dontCheckDiff = true;
                this.buy();
              },
            },
          ]);
          return;
        }

        // User info missing
        const errorMsgBase = '\n - ';
        if (res.nombre === false) errorMsg += errorMsgBase + 'Nombre';
        if (res.lastName === false) errorMsg += errorMsgBase + 'Apellido';
        if (res.email === false) errorMsg += errorMsgBase + 'Email';
        if (res.dni === false) errorMsg += errorMsgBase + 'DNI';
        if (res.phone === false) errorMsg += errorMsgBase + 'Teléfono';
        alert(errorMsg);
      } else window.location.href = res.externalCheckoutUrl;
    } catch (ex) {
      this.api.utilities.dismissLoading();
      alert(
        'Error al comprar los tokens. Por favor, contacte con info@febelink.com'
      );
      console.error(ex);
    }
  }
}
