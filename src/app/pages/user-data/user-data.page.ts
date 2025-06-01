import {Component, OnInit} from '@angular/core';
import {IUser} from '../../models/user.model';
import {UserSessionSvc} from '../../services/user-session.service';
import {UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, FormGroup} from '@angular/forms';
import {UserDataService} from './Services/user-data.service';
import {FilePickType, IFile} from '../../components/file-picker/models/file.model';
import {ToastSvc} from '../../services/toast.service';
import { KeywordService } from '../../admin/keyword/services/keyword.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  public username: string = "";
  public password: string = "";
  public repeatPass: string = "";
  public description: string = "";
 //@ts-ignore
  form: UntypedFormGroup;
  public nameuser: string = '';
  public passIgual: boolean = true;







  curUser: IUser | undefined;
   //@ts-ignore
  form2: UntypedFormGroup;
  public name: string = "";
  public dni: string = "";
  public empresa: string = "";
  public ciudad: string = "";
  public provincia: string = "";
  public direccion: string = "";
  public telefono: string = "+34";
  public web: string = "";
  public idioma: string = "";
  public tarjetaCredito: string = "";
  public numCuenta: string = "";
  provincianame: string = ""

  avatarUrl: string = "";
  userName: string = "";
  //@ts-ignore
  iFile: IFile ;
  filePickType = FilePickType;
  locations: any = []
  constructor(
    public sessionSvc: UserSessionSvc,
    private formBuilder: UntypedFormBuilder,
    private formBuilder2: UntypedFormBuilder,
    private userDataService: UserDataService,
    private toastSvc: ToastSvc,
    private keywordService: KeywordService,
  ) {
  }

  ngOnInit() {
    this.keywordService.getLocationKeywords().then(async (response: any) => {
      this.locations =response.response;
    })
    this.userDataService.getUserInfo().then()

    this.form = new FormGroup({
      
      username: new FormControl('', [Validators.nullValidator]),
      repeatPass: new FormControl('', [Validators.nullValidator]),
      password: new FormControl('', [Validators.nullValidator]),
      description: new FormControl('', [Validators.nullValidator]),
      
    })
    this.form2  = new FormGroup({
      name: new FormControl("", [Validators.nullValidator]),
      dni: new FormControl("", [Validators.nullValidator]),
      empresa: new FormControl("", [Validators.nullValidator]),
      direccion: new FormControl("", [Validators.nullValidator]),
      ciudad: new FormControl("", [Validators.nullValidator]),
      telefono: new FormControl("", [Validators.nullValidator]),
      web: new FormControl("", [Validators.nullValidator]),
      idioma: new FormControl("", [Validators.nullValidator]),
      tarjeta_credito: new FormControl("", [Validators.nullValidator]),
      num_cuenta: new FormControl("", [Validators.nullValidator]),
      
    })


    this.userDataService.getUserInfo().then(
      (datarResponse: any) => {
        let data = datarResponse.response
        this.userName = data.username;
        this.avatarUrl = data.avatarImageURL;
        this.provincia = data.locationId
        this.form?.controls['username'].setValue(data?.username) 
        this.form?.controls['description'].setValue(data?.description) 
        this.form2?.controls['name'].setValue(data?.name) 
        this.form2?.controls['dni'].setValue(data?.ID) 
        this.form2?.controls['empresa'].setValue(data?.business) 
        this.form2?.controls['direccion'].setValue(data?.address) 
        this.form2?.controls['ciudad'].setValue(data?.city) 

        //Verifico si tiene añadido el prefijo
        if (data?.phoneNumber?.includes("+34")) {
          this.form2?.controls['telefono'].setValue(data?.phoneNumber) 
        } else {
          this.form2?.controls['telefono'].setValue("+34" + data?.phoneNumber) 
        }
        
        this.form2?.controls['web'].setValue(data?.web) 
        this.form2?.controls['idioma'].setValue(data?.lang) 
        this.form2?.controls['tarjeta_credito'].setValue(data?.creditCard) 
        this.form2?.controls['num_cuenta'].setValue(data?.bankAccountNumber) 
       
      });

      
      this.getUser();

      
      
  }
  submitForm() {
  } 

  onSelect(hero: any): void {
  }
  onSelectChange($event: any){
    this.provincia = $event.target.value

    this.provincianame = this.locations.filter((location:any)=> location.id === Number($event.target.value))[0].title
  }
  async getUser() {

    this.curUser = await this.sessionSvc.get();

  }


  async onClickSubmit2() {

    this.name = this.form2?.get('name')?.value;
    this.dni = this.form2?.get('dni')?.value;
    this.empresa = this.form2?.get('empresa')?.value;
    this.ciudad = this.form2?.get('ciudad')?.value;
    this.direccion = this.form2?.get('direccion')?.value;
    this.telefono = this.form2?.get('telefono')?.value;
    this.web = this.form2?.get('web')?.value;
    this.idioma = this.form2?.get('idioma')?.value;
    this.tarjetaCredito = this.form2?.get('tarjeta_credito')?.value;
    this.numCuenta = this.form2?.get('num_cuenta')?.value;

    if (this.form2?.valid) {
      const datos = {
        name: this.name,
        ID: this.dni,
        business: this.empresa,
        address: this.direccion,
        city: this.ciudad,
        location: this.provincianame,
        locationId:this.provincia,
        phoneNumber: this.telefono,
        web: this.web,
        lang: this.idioma,
        creditCard: this.tarjetaCredito,
        bankAccountNumber: this.numCuenta,
      };


      this.userDataService.updatePersonalDataUser(datos)
        .then(res => {
          //console.log("test ceroideas",'Datos guardados con éxito : '+res);
        })
        .catch(err => {
          //console.log("test ceroideas",'Error al enviar los datos'+err);
        });
    }
  }
  userDetail(){
    sessionStorage.setItem('productId', String(this.curUser?.id))
  }
  async onClickSubmit() {
    this.username = this.form?.get('username')?.value;
    this.description = this.form?.get('description')?.value;

    if (this.form?.valid) {
      if (this.username != null && this.description != null && this.password == '') {
        this.password = '';
      }

      if (this.username != null || this.description != null) {
        if (this.password === '') {
          this.password = '';
        }
      }

      let datos = {
        'username': this.username,
        'password': '',
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

  async onSubmitNewPassword() {
    this.username = this.form?.get('username')?.value;
    this.description = this.form?.get('description')?.value;
    this.password = this.form?.get('password')?.value;
    this.repeatPass = this.form?.get('repeatPass')?.value;

    if (this.form?.valid) {
      if (this.password == this.repeatPass) {
        this.passIgual = true;
      } else {
        this.passIgual = false;
      }

      if (this.passIgual) {
        let datos = {
          'username': this.username,
          'password': this.password,
          'description': this.description || '',
          'avatarImage': this.iFile?.file
        };

        this.userDataService.updateBasicInfoUserData(datos)
          .then(res => {
            this.toastSvc.show('Contraseña guardada correctamente.');
            this.avatarUrl = res.response.avatarImageURL;
          })
          .catch(err => {
            this.toastSvc.show('Ha ocurrido un error inesperado durante la actualización. Por favor inténtelo de nuevo.');
          });
      }
    }
  }

  onImgError(event: any) {
    event.target.src = 'https://api.febelink.com/storage/users/default.png';
  }

  fileSelected(file: any) {
    this.avatarUrl = file.src
    this.iFile = file;
  }
}
