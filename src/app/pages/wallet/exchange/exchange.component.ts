import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Currency from 'src/app/models/currency.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
})
export class ExchangeComponent implements OnInit {

  currencyTypes = Currency.CryptoCurrencyTypes;
  @Input() origin: Currency.CryptoCurrency;
  @Input() destiny: Currency.CryptoCurrency;

  public exchangeForm: FormGroup;

  constructor(
      private modalController: ModalController
    , private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.builtForm();
  }

  ionViewDidLeave() {
    this.exchangeForm.reset();
  }

  builtForm() {
    this.exchangeForm = this.formBuilder.group({
      num_origin: new FormControl( Validators.required ),
      assetDestiny: new FormControl( Validators.required )
    });
  }

  onDismiss( ) {
    this.modalController.dismiss({ });
  }

  originChange( event ){
    this.origin.currency = event.detail.value;
  }
  destinyChange( event ){
    this.destiny.currency = event.detail.value;
  }
}
