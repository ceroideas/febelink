import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeoPlacesModel } from 'src/app/models/geoplaces.model';
import { ApiService } from 'src/app/services/api.service';
import { GeoPlacesApi } from 'src/app/services/geoplaces.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit, AfterViewInit {
  

  constructor(
    private utils: UtilitiesService
    , private modalCtrl: ModalController
    , private geoPlaces: GeoPlacesApi
    ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.geoPlaces
      .OnResponse(( place: GeoPlacesModel ) => {
          this.userData.address = place.address;
          this.userData.country = place.Country.short;
          this.userData.state = place.State.long;
          this.userData.department = place.Department.long;
          this.userData.locality = place.Locality.long;
          this.userData.place_id = place.place_id;
      })
      .OnError(( err ) => {
          console.log( 'Got this err', err );
          this.userData.address = null;
          this.userData.country = null;
          this.userData.state = null;
          this.userData.department = null;
          this.userData.locality = null;
          this.userData.place_id = null;
      })
      .initModal( 'address' );
  }

  userData:UserLanding = {};

  public getUserData(){
    if(!this.userData.name){
      this.utils.showToast("Rellena el nombre");
      return;
    } else if(!this.userData.lastName){
      this.utils.showToast("Rellena el apellido");
      return;
    } else if(!this.userData.email){
      this.utils.showToast("Rellena el email");
      return;
    } else if(!this.userData.dni){
      this.utils.showToast("Rellena el DNI");
      return;
    } else if( !this.geoPlaces.hasSelected() ){
      this.utils.showToast("Escribe y selecciona tu dirección completa");
      return;
    } else if(!this.userData.phone){
      this.utils.showToast("Introduce tu número de teléfono");
      return;
    }
    // Esto es para que actualice los datos con lo que ha seleccionado
    this.geoPlaces.fillUserPlace( this.userData );

    this.modalCtrl.dismiss({userCompleteData: this.userData});
  }
}
