import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.model';
import { UserSessionSvc } from 'src/app/services/user-session.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  curUser: IUser;
  form: UntypedFormGroup;

  constructor(
    public sessionSvc: UserSessionSvc, 
    private formBuilder: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: [''],
      password: [''],
      cambiopass: [''],
      aboutme: ['']
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
