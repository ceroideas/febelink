import {Component, OnInit} from '@angular/core';
import {IUser} from 'src/app/models/user.model';
import {UserSessionSvc} from 'src/app/services/user-session.service';
import {UntypedFormGroup, UntypedFormBuilder} from '@angular/forms';
import {UserDataService} from './Services/user-data.service';
import {IFile} from '../../components/file-picker/models/file.model';
import {ToastSvc} from '../../services/toast.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  public username: string = null;
  public password: string = null;
  public repeatPass: string = null;
  public description: string = null;

  form: UntypedFormGroup;
  public nameuser: string = '';
  public passIgual: boolean = true;

  avatarUrl: string;
  iFile: IFile;

  constructor(
    public sessionSvc: UserSessionSvc,
    private formBuilder: UntypedFormBuilder,
    private userDataService: UserDataService,
    private toastSvc: ToastSvc
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
        this.avatarUrl = data.response.avatarImageURL;
      });
  }

  async onClickSubmit() {

    this.username = this.form.get('username').value;
    this.password = this.form.get('password').value;
    this.repeatPass = this.form.get('repeatPass').value;
    this.description = this.form.get('description').value;

    if (this.form.valid) {

      if (this.password == this.repeatPass) {
        this.passIgual = true;
      } else {
        this.passIgual = false;
      }


      if (this.username != null && this.description != null && this.password == '') {
        this.password = '';
      }

      if (this.username != null || this.description != null) {
        if (this.password === '') {
          this.password = '';
        }

      }

      if (this.passIgual) {
        let datos = {
          'username': this.username,
          'password': this.password,
          'description': this.description,
          'avatarImage': this.iFile?.file
        };

        this.userDataService.updateBasicInfoUserData(datos)
          .then(res => {
            this.toastSvc.show('Información actualizada correctamente.');
            this.avatarUrl = res.response.avatarImageURL;
          })
          .catch(err => {
            this.toastSvc.show('Ha ocurrido un error inesperado durante la actualización. Por favor inténtelo de nuevo.');
          });
      }
    }
  }

  onImgError(event) {
    event.target.src = 'https://api.febelink.com/storage/users/default.png';
  }

  fileSelected(file: IFile) {
    this.iFile = file;
  }
}
