import {Component, OnInit} from '@angular/core';
import {IUser} from 'src/app/models/user.model';
import {UserSessionSvc} from 'src/app/services/user-session.service';
import {UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {UserDataService} from './Services/user-data.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  curUser: IUser;
  form: UntypedFormGroup;
  public nameuser: string = '';
  public passIgual: boolean = true;

  constructor(
    public sessionSvc: UserSessionSvc,
    private formBuilder: UntypedFormBuilder,
    private userDataService: UserDataService
  ) {
  }

  ngOnInit() {
    this.userDataService.getUserInfo().then(
      (data) => {
        this.form = this.formBuilder.group({
          username: data.response.username,
          changePass: [''],
          password: [''],
          description: data.response.description,
        });
      });

    this.getUser();
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async onClickSubmit() {
    console.log('Click submit');
    if (this.form.valid) {
      if(this.form.get('password').value == this.form.get('changePass').value){
        this.passIgual = true;
      }else{
        this.passIgual = false;
      }

      if(this.passIgual){
        let datos = {
          "username": this.form.get('username').value,
          "password": this.form.get('password').value,
          "description": this.form.get('description').value
        }

        this.userDataService.updateBasicInfoUserData(datos)
        .then(res => {
          console.log('Datos guardados con éxito : '+res);
        })
        .catch(err => {
          console.log('Error al enviar los datos : '+err);
        })
      }
      
    }
  }

}
