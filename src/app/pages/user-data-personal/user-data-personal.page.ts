import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';
import { UserDataPersonalService } from './Services/user-data-personal.services';

@Component({
  selector: 'app-user-data-personal',
  templateUrl: './user-data-personal.page.html',
  styleUrls: ['./user-data-personal.page.scss'],
})
export class UserDataPersonalPage implements OnInit {
  curUser: IUser;
  form: UntypedFormGroup;

  constructor(public sessionSvc: UserSessionSvc, 
    private formBuilder: UntypedFormBuilder, private userDataPersonalService: UserDataPersonalService) { }

  ngOnInit() {
    this.userDataPersonalService.getUserInfo().then(
      (data) => {
        this.form = this.formBuilder.group({
          name: data.response.username,
          dni: [''],
          empresa: data.response.business,
          direccion: data.response.address,
          telefono: data.response.phoneNumber,
          web: data.response.web,
          idioma: data.response.lang,
          tarjeta_credito: data.response.creditCard,
          num_cuenta: data.response.bankAccountNumber,
          password: [''],
          aboutme:data.response.description
        });
      });
    this.getUser();
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async onClickSubmit(){
    if (this.form.valid) {
      const datos = {
        username: this.form.get('name').value,
        business: this.form.get('empresa').value,
        address: this.form.get('direccion').value,
        phoneNumber: this.form.get('telefono').value,
        web: this.form.get('web').value,
        lang: this.form.get('idioma').value,
        creditCard: this.form.get('tarjeta_credito').value,
        bankAccountNumber: this.form.get('num_cuenta').value,
      }

      this.userDataPersonalService.updatePersonalDataUser(datos)
      .then(res =>{
        console.log('Datos guardados con éxito : '+res);
      })
      .catch(err =>{
        console.log('Error al enviar los datos'+err);
      })
    }
  }

  onSubmit(){
    console.log('click onSubmit');
  }

}
