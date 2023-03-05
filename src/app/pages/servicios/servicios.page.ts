import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, Platform, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { MailService } from 'src/app/services/mail.service';
import { ReportService } from 'src/app/services/report.service';
import { ServicesService } from './services/services.service';
import { IServiceFull } from './models/services.model';
import { SubscriptionService } from '../suscripciones/Services/subscription.service';
import { Subscription } from '../suscripciones/suscripciones.page';
import { ToastSvc } from '../../services/toast.service';
import {
  FilePickType,
  IFile,
} from '../../components/file-picker/models/file.model';
import { iWYSIWYG } from 'src/app/components/wysiwyg/models/wysiwyg.model';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  isSlideDrag: boolean = false;

  isDisponibles: boolean = true;
  isCurso: boolean = false;
  isFinalizados: boolean = false;
  isNuevoServicio: boolean = false;
  indexTerminarServicio: number;
  indexTerminarServicioMobile: boolean = false;
  indexValorarServicio: boolean = false;
  finValorarServicio: boolean = false;
  servicioAdded: boolean = false;

  dragLogged: boolean = false;

  unitTypes: any;
  iProducts: any;
  doUpdate: boolean = false;
  editUpdate: number;
  productIdTerminar: number;
  cartIdTerminar: number;
  isTemplate: boolean = false;

  title: string;
  description: string;
  unitPrice: number | string;
  unitType: number;
  sector: number;
  images: (string | IFile)[] = new Array(5);

  editorText: string;

  iProfessions: any;
  iUserProfession: any;
  ProfessionsMapped: any;

  numbServicesAvaliable: number = 3;

  iFile: IFile;
  filePickType = FilePickType;

  constructor(
    public platform: Platform,
    public popoverController: PopoverController,
    private router: Router,
    public alertController: AlertController,
    public userSvc: UserService,
    public mailSvc: MailService,
    public reportSvc: ReportService,
    public servicesSvc: ServicesService,
    private subService: SubscriptionService,
    private toastSvc: ToastSvc
  ) {}

  ngOnInit() {
    this.unitTypes = [
      { id: 1, name: 'Día', shorthand: 'día', lang: 'ES' },
      { id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES' },
      { id: 3, name: 'Año', shorthand: 'año', lang: 'ES' },
      { id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES' },
      { id: 5, name: 'Hora', shorthand: 'hora', lang: 'ES' },
      { id: 6, name: 'Consulta', shorthand: 'consulta', lang: 'ES' },
      { id: 7, name: 'Sesión', shorthand: 'sesión', lang: 'ES' },
      { id: 8, name: 'Jornada', shorthand: 'jornada', lang: 'ES' },
      { id: 9, name: 'Oferta', shorthand: 'oferta', lang: 'ES' },
      { id: 10, name: 'Campaña', shorthand: 'campaña', lang: 'ES' },
      { id: 11, name: 'Porcentaje', shorthand: '%', lang: 'ES' },
    ];
    this.getProducts();
    this.getProfessions();
    this.getNumServicesAvaliables();
  }

  async getNumServicesAvaliables() {
    const { response } = await this.subService.getMySubscriptions();
    if (response) {
      response.forEach((elem: Subscription) => {
        if (elem.subscriptionName === 'sub-pro') {
          this.numbServicesAvaliable += 20;
        }
        if (elem.subscriptionName === 'sub-plus') {
          this.numbServicesAvaliable += elem.amount;
        }
      });
    }
  }

  async getProducts() {
    const { response, error } = await this.servicesSvc.get();
    this.iProducts = response;
    response?.available?.forEach((elem) => {
      if (!elem.isTemplate && elem.isPublished) {
        this.numbServicesAvaliable -= 1;
      }
    });
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
    this.ProfessionsMapped = this.iUserProfession.map((e, i) => {
      let temp = this.iProfessions.find(
        (element) => element.id === e.subSectorId
      );
      if (temp.name) {
        e.name = temp.name;
      }
      return e;
    });
  }

  selectNuevoServicio() {
    if (this.numbServicesAvaliable > 0) {
      this.isNuevoServicio = true;
    } else {
      this.toastSvc.show(
        'Cambia a Plan PRO o añade productos PLUS para poder crear ofertas activas adicionales.'
      );
    }
  }

  async addNuevoServicio() {
    var productCreate: IServiceFull = {
      title: this.title,
      description: this.editorText,
      productUnitPrice: this.unitPrice.toString().replace(/,/g, '.'),
      unitTypeId: this.unitType,
      subSectorId: this.sector,
      images: this.images,
    };

    console.log('FILE: ', this.images);
    const { response, error } = await this.servicesSvc.create(productCreate);

    this.getProducts();

    this.isNuevoServicio = false;
    this.servicioAdded = true;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
    this.title = null;
    this.description = null;
    this.unitPrice = null;
    this.unitType = null;
    this.sector = null;
    this.isTemplate = false;
  }

  async selectEditarServicio(service: IServiceFull) {
    this.title = service.title;
    this.description = service.description;
    this.unitPrice = service.productUnitPrice;
    this.unitType = service.unitTypeId;
    this.sector = service.subSectorId;
    this.editUpdate = service.productId;
    service.images.forEach((value, index) => {
      this.images[index] = value;
    });

    if (!service.isTemplate) {
      this.doUpdate = true;
    } else {
      this.isTemplate = true;
    }
    this.isNuevoServicio = true;
  }

  async editServicio() {
    var productEdit: IServiceFull = {
      productId: this.editUpdate,
      title: this.title,
      description: this.editorText,
      productUnitPrice: this.unitPrice,
      unitTypeId: this.unitType,
      subSectorId: this.sector,
      images: this.images,
    };

    const { response, error } = await this.servicesSvc.update(productEdit);

    this.getProducts();

    this.isNuevoServicio = false;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
    this.doUpdate = false;
    this.editUpdate = null;
    this.title = null;
    this.description = null;
    this.unitPrice = null;
    this.unitType = null;
    this.sector = null;
    this.isTemplate = false;
  }

  cancelNuevoServicio() {
    this.isNuevoServicio = false;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
    this.doUpdate = false;
    this.editUpdate = null;
    this.title = null;
    this.description = null;
    this.unitPrice = null;
    this.unitType = null;
    this.sector = null;
    this.isTemplate = false;
    this.images.fill(null);
  }

  logDrag(event: any, index: number, product: number, cart: number) {
    let ratio = event.detail.ratio;
    if (ratio < -11 && !this.dragLogged) {
      this.dragLogged = true;
      this.terminarServicio(index, product, cart);
    }
  }

  terminarServicio(index: number, product: number, cart: number) {
    this.indexTerminarServicio = index;
    this.indexTerminarServicioMobile = true;
    this.productIdTerminar = product;
    this.cartIdTerminar = cart;
  }

  cancelarServicio() {
    this.indexTerminarServicio = null;
    this.indexTerminarServicioMobile = false;
    this.dragLogged = false;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
  }

  valorarServicio() {
    this.indexValorarServicio = true;
    this.indexTerminarServicioMobile = false;
    this.dragLogged = false;
  }

  async aceptarValorarServicio() {
    var productFinish: IServiceFull = {
      cartId: this.cartIdTerminar,
      productId: this.productIdTerminar,
    };

    const { response, error } = await this.servicesSvc.finish(productFinish);

    this.getProducts();

    this.finValorarServicio = true;
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    this.indexTerminarServicio = null;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
    this.isDisponibles = false;
    this.isCurso = false;
    this.isFinalizados = true;
  }

  cancelarValorarServicio() {
    this.indexValorarServicio = false;
    this.indexTerminarServicioMobile = false;
    this.indexTerminarServicio = null;
    this.productIdTerminar = null;
    this.cartIdTerminar = null;
  }

  cerrarFinValorarServicio() {
    this.finValorarServicio = false;
  }

  selectDisponibles() {
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
  }

  selectCurso() {
    this.isDisponibles = false;
    this.isCurso = true;
    this.isFinalizados = false;
  }

  selectFinalizados() {
    this.isDisponibles = false;
    this.isCurso = false;
    this.isFinalizados = true;
  }

  closeServicioAdded() {
    this.servicioAdded = false;
    this.isDisponibles = true;
    this.isCurso = false;
    this.isFinalizados = false;
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  clearImageByIndex(index: number) {
    this.images[index] = null;
  }

  fileSelected(iFile: IFile, index: number) {
    this.images[index] = iFile;
  }

  wysiwygChange(content: iWYSIWYG) {
    this.editorText = content.html;
  }
}
