import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit {
  provincias: any[];
  localidades: any[];
  provincia: any;
  localidad: any;

  constructor(
    private utils: UtilitiesService
    , private modalCtrl: ModalController
    , private api: ApiService
    ) { }

  ngOnInit() {
    this.obtenerProvincias()
  }

  userData:UserLanding = {};

  getUserData(){

    this.userData.province_id = this.provincia?.id;
    this.userData.town_id = this.localidad?.id;

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
    } else if(!this.userData.address){
      this.utils.showToast("Introduce tu dirección completa");
      return;
    } else if(!this.userData.phone){
      this.utils.showToast("Introduce tu número de teléfono");
      return;
    } else if(!this.userData.province_id){
      this.utils.showToast("Introduce tu provincia");
      return;
    } else if(!this.userData.town_id){
      this.utils.showToast("Introduce tu localidad");
      return;
    }
    // console.log(this.userData);
    this.modalCtrl.dismiss({userCompleteData: this.userData});
  }

  async obtenerProvincias() {
    (await this.api.obtenerProvincias()).subscribe((provincias) => {
        this.provincias = provincias;
        
        if (this.userData.province_id != null) {
            let prov = this.provincias.filter(
                (x) => x.id == this.userData.province_id
            );
            this.provincia = prov[0];
            //this.form.get('provincia').setValue(this.provincia);
            this.obtenerLocalidades(this.userData.province_id);
        }
    });
  }

  async obtenerLocalidades(id_provincia) {
      (await this.api.obtenerLocalidades(id_provincia)).subscribe(
          (localidades) => {
              this.localidades = localidades;
              if (this.userData.town_id != null) {
                  let loc = this.localidades.filter((x) => x.id == this.userData.town_id);
                  this.localidad = loc[0];
              }
          }
      );
  }

  public provinciasChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }): void {
      this.localidades = [];
      this.provincia = event.value;
      this.localidad = null;
      this.obtenerLocalidades(event.value.id);
      // this.saveProvince = event.value.name;
      //console.log(this.saveProvince);
  }

  public localidadesChange(event: {
    component: IonicSelectableComponent;
    value: any;
}): void {
    this.localidad = event.value;
}
}
