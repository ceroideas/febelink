import {Component, OnInit} from '@angular/core';
import {IUser} from 'src/app/models/user.model';
import {UserSessionSvc} from 'src/app/services/user-session.service';
import {UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';
import {UserDataService} from './Services/user-data.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  curUser: IUser;
  public username: string = null;
  public password: string = null;
  public repeatPass: string = null;
  public description: string = null;

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
          repeatPass: [''],
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

    this.username = this.form.get('username').value;
    this.password = this.form.get('password').value;
    this.repeatPass = this.form.get('repeatPass').value;
    this.description = this.form.get('description').value;

    if (this.form.valid) {
      
      if(this.password == this.repeatPass){
        this.passIgual = true;
      }else{
        this.passIgual = false;
      }


      if(this.username != null && this.description != null && this.password == ''){
        this.password = "";
      }

      if(this.username != null || this.description != null){
        if(this.password === ''){
          this.password = "";
        }
        
      }

      if(this.passIgual){
        let datos = {
          "username": this.username,
          "password": this.password,
          "description": this.description
        }

        this.userDataService.updateBasicInfoUserData(datos)
        .then(res => {
          //console.log('Datos guardados con éxito : '+res);
        })
        .catch(err => {
          //console.log('Error al enviar los datos : '+err);
        })
      
      }
      
    }
  }

}
