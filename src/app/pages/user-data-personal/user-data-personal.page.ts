import {Component, OnInit} from '@angular/core';
import {IUser} from '../../models/user.model';
import {UserSessionSvc} from '../../services/user-session.service';
import {UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';
import {UserDataPersonalService} from './Services/user-data-personal.services';

@Component({
  selector: 'app-user-data-personal',
  templateUrl: './user-data-personal.page.html',
  styleUrls: ['./user-data-personal.page.scss'],
})
export class UserDataPersonalPage implements OnInit {
  curUser: IUser  | undefined;;
  form: UntypedFormGroup  | undefined;;
  public name: string = "";
  public dni: string = "";
  public empresa: string = "";
  public direccion: string = "";
  public telefono: string = "";
  public web: string = "";
  public idioma: string = "";
  public tarjetaCredito: string = "";
  public numCuenta: string = "";

  constructor(public sessionSvc: UserSessionSvc,
              private formBuilder: UntypedFormBuilder, private userDataPersonalService: UserDataPersonalService) {
  }

  ngOnInit() {
    this.userDataPersonalService.getUserInfo().then(
      (data) => {
        this.form = this.formBuilder.group({
          name: data.response.name,
          dni: data.response.ID,
          empresa: data.response.business,
          direccion: data.response.address,
          telefono: data.response.phoneNumber,
          web: data.response.web,
          idioma: data.response.lang,
          tarjeta_credito: data.response.creditCard,
          num_cuenta: data.response.bankAccountNumber,
        });
      });
    this.getUser();
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async onClickSubmit() {

    this.name = this.form?.get('name')?.value;
    this.dni = this.form?.get('dni')?.value;
    this.empresa = this.form?.get('empresa')?.value;
    this.direccion = this.form?.get('direccion')?.value;
    this.telefono = this.form?.get('telefono')?.value;
    this.web = this.form?.get('web')?.value;
    this.idioma = this.form?.get('idioma')?.value;
    this.tarjetaCredito = this.form?.get('tarjeta_credito')?.value;
    this.numCuenta = this.form?.get('num_cuenta')?.value;

    if (this.form?.valid) {
      const datos = {
        name: this.name,
        ID: this.dni,
        business: this.empresa,
        address: this.direccion,
        phoneNumber: this.telefono,
        web: this.web,
        lang: this.idioma,
        creditCard: this.tarjetaCredito,
        bankAccountNumber: this.numCuenta,
      };

      this.userDataPersonalService.updatePersonalDataUser(datos)
        .then(res => {
          //console.log("test ceroideas",'Datos guardados con éxito : '+res);
        })
        .catch(err => {
          //console.log("test ceroideas",'Error al enviar los datos'+err);
        });
    }
  }

  submitForm() {
  }
}
