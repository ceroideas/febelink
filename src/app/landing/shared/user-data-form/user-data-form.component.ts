import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { UserLanding } from '../../models/user-landing';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit {

  constructor(private utils: UtilitiesService) { }

  ngOnInit() {}

  userData:UserLanding = {};

  getUserData(){

    if(!this.userData.name){
      this.utils.showToast("Rellena el nombre");
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
    }

    console.log(this.userData);    
  }

}
