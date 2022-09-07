import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data-personal',
  templateUrl: './user-data-personal.page.html',
  styleUrls: ['./user-data-personal.page.scss'],
})
export class UserDataPersonalPage implements OnInit {
  curUser: IUser;
  form: UntypedFormGroup;

  constructor(public sessionSvc: UserSessionSvc, 
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [''],
      dni: [''],
      empresa: [''],
      direccion: [''],
      telefono: [''],
      web: [''],
      idioma: [''],
      tarjeta_credito: [''],
      num_cuenta: [''],
      password: [''],
      aboutme:['']
    });
    this.getUser();
  }

  async getUser() {
    this.curUser = await this.sessionSvc.get();
  }

  async submitForm(){
    if (this.form.valid) {}
  }

}
