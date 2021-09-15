import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.scss'],
})
export class UserDataFormComponent implements OnInit {

  constructor(private utils: UtilitiesService) { }

  ngOnInit() {}

  getUserData(form:NgForm){
    const userData = {
      name: form.value.name
      , email: form.value.email
      , dni: form.value.dni
      , address: form.value.adress
      , phone: form.value.phone
    };

    if(!userData.name){
      this.utils.showToast("Rellena el nombre");
      return;
    } else if(!userData.email){
      this.utils.showToast("Rellena el email");
      return;
    } else if(!userData.dni){
      this.utils.showToast("Rellena el DNI");
      return;
    } else if(!userData.address){
      this.utils.showToast("Introduce tu dirección completa");
      return;
    } else if(!userData.phone){
      this.utils.showToast("Introduce tu número de teléfono");
      return;
    }

    console.log(userData);    
  }

}
