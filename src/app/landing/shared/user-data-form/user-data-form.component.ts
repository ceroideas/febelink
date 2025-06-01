import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoPlacesModel } from '../../../models/geoplaces.model';
import { GeoPlacesApi } from '../../../services/geoplaces.service';
import { TranslateConfigService } from '../../../services/translate/translate-config.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { UserLanding } from '../../models/user-landing';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit, AfterViewInit {

  labelDoc: string ="";

  constructor(
    private utils: UtilitiesService
    , private modalCtrl: ModalController
    , private geoPlaces: GeoPlacesApi
    , private elementRef: ElementRef
    , private translateService: TranslateConfigService
    ) { }

  ngOnInit() {
    this.setKYClabels();
  }

  // To add verified KYC values ( if already done )
  setKYClabels() {
    this.labelDoc = this.translateService.instant( 'common.personal.id' )
      + ( !this.userData?.doc_type ? '' : ' - ' + this.translateService.instant( 'kyc.docTypes.' + this.userData.doc_type ));
  }

  ngAfterViewInit() {
    const address = this.elementRef.nativeElement.querySelector( '#address' );
               
    this.geoPlaces
      .OnResponse(( place: GeoPlacesModel ) => {
          this.userData.address = place?.address;
          this.userData.country = place?.Country?.short;
          this.userData.state = place?.State?.long;
          this.userData.department = place?.Department?.long;
          this.userData.locality = place?.Locality?.long;
          this.userData.place_id = place?.place_id;
      })
      .OnError(( err ) => {
          console.log( 'Got this err', err );
          this.userData.address = undefined;
          this.userData.country = undefined;
          this.userData.state = undefined;
          this.userData.department = undefined;
          this.userData.locality = undefined;
          this.userData.place_id = undefined;
      })
      .initModal( address );
      this.geoPlaces.setUserPlace( this.userData );
  }

  userData:UserLanding = {};

  public getUserData(){
    if(!this.userData.nick){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.name"));
      return;
    } else if(!this.userData.lastName){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.surname"));
      return;
    } else if(!this.userData.email){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.email"));
      return;
    } else if(!this.userData.dni){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.id"));
      return;
    } else if( !this.geoPlaces.hasSelected() ){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.address"));
      return;
    } else if(!this.userData.phone){
      this.utils.showToast(
        this.translateService.instant("common.personal.errors.phone"));
      return;
    }
    // Esto es para que actualice los datos con lo que ha seleccionado
    this.geoPlaces.fillUserPlace( this.userData );

    this.modalCtrl.dismiss({userCompleteData: this.userData});
  }
}
