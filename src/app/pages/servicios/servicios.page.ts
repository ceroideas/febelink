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
import { ServicesService } from './services/services.service';
import { NgStyle } from '@angular/common';
import { IServiceFull} from './models/services.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  isSlideDrag:boolean=false;

  isDisponibles:boolean=true;
  isCurso:boolean=false;
  isFinalizados:boolean=false;
  isNuevoServicio:boolean=false;
  indexTerminarServicio:number;
  indexTerminarServicioMobile:boolean=false;
  indexValorarServicio:boolean=false;
  finValorarServicio:boolean=false;
  servicioAdded:boolean=false;

  dragLogged:boolean=false;

  unitTypes:any;
  iProducts:any;
  doUpdate:boolean=false;
  editUpdate:number;
  productIdTerminar:number;
  cartIdTerminar:number;
  isTemplate:boolean=false;

  title:string;
  description:string;
  unitPrice:number;
  unitType:number;
  sector:number;

  iProfessions:any;
  iUserProfession:any;
  ProfessionsMapped:any;

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
    public reportSvc: ReportService,
    public servicesSvc: ServicesService
  ) {

  }


  ngOnInit() {

    this.unitTypes = [
      {id:1,name:"Día",shorthand:"día",lang:"ES"},
      {id:2,name:"Mes",shorthand:"mes",lang:"ES"},
      {id:3,name:"Año",shorthand:"año",lang:"ES"},
      {id:4,name:"Unidad",shorthand:"ud.",lang:"ES"}
    ];
    this.getProducts();
    this.getProfessions();
  }

  async getProducts() {
    const { response, error } = await this.servicesSvc.get();
    this.iProducts = response;
  }

  async getProfessions() {
    const { response, error } = await this.servicesSvc.professions();
    this.iProfessions = response;
    this.getUserProfession();
  }

  async getUserProfession() {
    const { response, error } = await this.servicesSvc.userProfession();
    this.iUserProfession = response;
    this.mapProfessions();
  }

  mapProfessions() {
    this.ProfessionsMapped = this.iUserProfession.map((e,i)=>{
      let temp = this.iProfessions.find(element=> element.id === e.subSectorId)
      if(temp.name) {
        e.name = temp.name;
      }
      return e;
    });
  }

  selectNuevoServicio() {
    this.isNuevoServicio=true;
  }

  async addNuevoServicio() {

    var productCreate:IServiceFull = {
      title: this.title,
      description: this.description,
      productUnitPrice: this.unitPrice,
      unitTypeId: this.unitType,
      subSectorId: this.sector
    }

    const { response, error } = await this.servicesSvc.create(productCreate);

    this.getProducts();

    this.isNuevoServicio=false;
    this.servicioAdded=true;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
    this.title=null;
    this.description=null;
    this.unitPrice=null;
    this.unitType=null;
    this.sector=null;
    this.isTemplate = false;

  }

  async selectEditarServicio(service:IServiceFull) {

    this.title=service.title;
    this.description=service.description;
    this.unitPrice=service.productUnitPrice;
    this.unitType=service.unitTypeId;
    this.sector=service.subSectorId;

    if(!service.isTemplate){
      this.doUpdate = true;
      this.editUpdate = service.productId;
    }
    else{
      this.isTemplate = true;
    }
    this.isNuevoServicio=true;
  }

  async editServicio() {

    var productEdit:IServiceFull = {
      productId: this.editUpdate,
      title: this.title,
      description: this.description,
      productUnitPrice: this.unitPrice,
      unitTypeId: this.unitType,
      subSectorId: this.sector
    }

    const { response, error } = await this.servicesSvc.update(productEdit);

    this.getProducts();

    this.isNuevoServicio=false;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
    this.doUpdate=false;
    this.editUpdate=null;
    this.title=null;
    this.description=null;
    this.unitPrice=null;
    this.unitType=null;
    this.sector=null;
    this.isTemplate = false;
  }

  cancelNuevoServicio() {
    this.isNuevoServicio=false;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
    this.doUpdate=false;
    this.editUpdate=null;
    this.title=null;
    this.description=null;
    this.unitPrice=null;
    this.unitType=null;
    this.sector=null;
    this.isTemplate = false;
  }


  logDrag(event:any,index:number,product:number,cart:number){
    let ratio = event.detail.ratio;
    if(ratio<-11 && !this.dragLogged){
      this.dragLogged=true;
      this.terminarServicio(index,product,cart);
    }
  }
  terminarServicio(index:number,product:number,cart:number) {
    this.indexTerminarServicio=index;
    this.indexTerminarServicioMobile=true;
    this.productIdTerminar=product;
    this.cartIdTerminar=cart;
  }
  cancelarServicio() {
    this.indexTerminarServicio=null;
    this.indexTerminarServicioMobile=false;
    this.dragLogged=false;
    this.productIdTerminar=null;
    this.cartIdTerminar=null;
  }
  valorarServicio() {
    this.indexValorarServicio=true;
    this.indexTerminarServicioMobile=false;
    this.dragLogged=false;
  }
  async aceptarValorarServicio() {

    var productFinish:IServiceFull = {
      cartId: this.cartIdTerminar,
      productId: this.productIdTerminar
    }

    const { response, error } = await this.servicesSvc.finish(productFinish);

    this.getProducts();

    this.finValorarServicio=true;
    this.indexValorarServicio=false;
    this.indexTerminarServicioMobile=false;
    this.indexTerminarServicio=null;
    this.productIdTerminar=null;
    this.cartIdTerminar=null;
    this.isDisponibles=false;
    this.isCurso=false;
    this.isFinalizados=true;
  }
  cancelarValorarServicio() {
    this.indexValorarServicio=false;
    this.indexTerminarServicioMobile=false;
    this.indexTerminarServicio=null;
    this.productIdTerminar=null;
    this.cartIdTerminar=null;
  }
  cerrarFinValorarServicio() {
    this.finValorarServicio=false;
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
  closeServicioAdded() {
    this.servicioAdded=false;
    this.isDisponibles=true;
    this.isCurso=false;
    this.isFinalizados=false;
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }
}
