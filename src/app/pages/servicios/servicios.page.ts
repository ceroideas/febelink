import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController, PopoverController, Platform, AlertController } from '@ionic/angular';
import { PublicarOpinionPage } from '../publicar-opinion/publicar-opinion.page';
import { GuidePage } from '../guide/guide.page';
import { SharePopoverComponent } from 'src/app/components/share-popover/share-popover.component';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { IUser } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { IReport } from 'src/app/models/report.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  isSlideDrag:boolean=false;
  dataServicios:any;
  dataClientesCurso:any;
  dataClientesFinalizados:any;

  isDisponibles:boolean=true;
  isCurso:boolean=false;
  isFinalizados:boolean=false;
  isNuevoServicio:boolean=false;
  indexTerminarServicio:any;
  indexTerminarServicioMobile:boolean=false;
  indexValorarServicio:boolean=false;
  finValorarServicio:boolean=false;
  servicioAdded:boolean=false;

  dragLogged:boolean=false;

  constructor(
    private route: ActivatedRoute,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    private utilities: UtilitiesService,
    private translateService: TranslateService,
    private authSvc:AuthenticationService,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService
  ) {

  }


  ngOnInit() {
    this.dataServicios = [
      {
        tipo: 'disponible',
        nombre: 'Masaje drenante',
        descripcion: "Descripción del producto. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's.",
        precio: 35,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev.png',
        valoraciones: 50,
        num_valoraciones: 10
      },
      {
        tipo: 'disponible',
        nombre: 'Masaje relajación',
        descripcion: "Descripción del producto. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's.",
        precio: 45,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev-2.png',
        valoraciones: 40,
        num_valoraciones: 10,
        publicado: true
      },
      {
        tipo: 'disponible',
        nombre: 'Colocación de toldos',
        descripcion: "Descripción del producto. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since. Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's.",
        precio: 24,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev-3.png',
        valoraciones: 45,
        num_valoraciones: 10
      },
    ];

    this.dataClientesCurso = [
      {
        nombre: 'Masaje drenante',
        precio: 35,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev.png',
        cliente: 'Miguel Fernández',
        fecha: '20/08/2022',
      },
      {
        nombre: 'Masaje drenante',
        precio: 35,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev.png',
        cliente: 'Mario Moreno',
        fecha: '24/08/2022',
      },
      {
        nombre: 'Masaje relajación',
        precio: 45,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev-2.png',
        cliente: 'Rodrigo Hernández',
        fecha: '28/08/2022',
      }
    ];

    this.dataClientesFinalizados = [
      {
        nombre: 'Masaje drenante',
        precio: 35,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev.png',
        cliente: 'Luis Fernández',
        fecha: '18/08/2022',
        valoracion: 4,
        comentario: 'Buen cliente'
      },
      {
        nombre: 'Masaje drenante',
        precio: 35,
        precio_por: 'mes',
        img: 'assets/imgs/servicios-prev.png',
        cliente: 'Gustavo Moreno',
        fecha: '19/08/2022',
        valoracion: 5,
        comentario: 'Fantástico'
      },
    ];
  }

  selectDisponibles() {
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
  }
  selectCurso() {
    this.isDisponibles=false;
    this.isCurso=true;
    this.isFinalizados=false;
  }
  selectFinalizados() {
    this.isDisponibles=false;
    this.isCurso=false;
    this.isFinalizados=true;
  }
  selectNuevoServicio() {
    this.isNuevoServicio=true;
  }
  cancelNuevoServicio() {
    this.isNuevoServicio=false;
  }
  addNuevoServicio() {
    this.isNuevoServicio=false;
    this.servicioAdded=true;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
  }
  closeServicioAdded() {
    this.servicioAdded=false;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
  }
  terminarServicio(index:any) {
    this.indexTerminarServicio=index;
    this.indexTerminarServicioMobile=true;
  }
  cancelarServicio() {
    this.indexTerminarServicio='-';
    this.indexTerminarServicioMobile=false;
    this.dragLogged=false;
  }
  valorarServicio() {
    this.indexValorarServicio=true;
    this.indexTerminarServicioMobile=false;
    this.dragLogged=false;
  }
  aceptarValorarServicio() {
    this.finValorarServicio=true;
    this.indexValorarServicio=false;
    this.indexTerminarServicioMobile=false;
    this.indexTerminarServicio='-';
    this.isDisponibles=false;
    this.isCurso=false;
    this.isFinalizados=true;
  }
  cancelarValorarServicio() {
    this.indexValorarServicio=false;
    this.indexTerminarServicioMobile=false;
    this.indexTerminarServicio='-';
  }
  cerrarFinValorarServicio() {
    this.finValorarServicio=false;
  }

  logDrag(event:any,index:any){
    let ratio = event.detail.ratio;
    if(ratio<-11 && !this.dragLogged){
      this.dragLogged=true;
      this.terminarServicio(index);
    }
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
