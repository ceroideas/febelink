import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FilePickType,
  IFile,
} from '../../components/file-picker/models/file.model';
import {iWYSIWYG} from 'src/app/components/wysiwyg/models/wysiwyg.model';
import { ISearchFull } from './models/lo-buscamos-por-ti.model';
import { SearchforyouService } from 'src/app/services/searchforyou.service';
import { KeywordService } from 'src/app/admin/keyword/services/keyword.service';
import { ApiService } from 'src/app/services/api.service';
import { IUser } from 'src/app/models/user.model';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-lo-buscamos-por-ti',
  templateUrl: './lo-buscamos-por-ti.page.html',
  styleUrls: ['./lo-buscamos-por-ti.page.scss'],
})
export class LoBuscamosPorTiPage implements OnInit {

  iFile: IFile;
  filePickType = FilePickType;

  error: any = {}

  servicioFinsish: boolean = false;
  servicioAdded: boolean = false;
  servicioError: boolean = false;
  servicioAddedOther: boolean = false;
  loadSend: boolean = false;
  title: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  location: string;

  images: (string | IFile)[] = [];

  editorText: string;
  isTemplate: boolean = false;
  locations: any = [];
  selectedValue
  currentUser: any = {
    nick: null,
    email: null,
    telefono: null
  }
  constructor(  private router: Router,  private utilities: UtilitiesService,  private api: ApiService, private keywordService: KeywordService, private modalCtrl: ModalController,  public servicesSvc: SearchforyouService,  public cref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.readLocations()

    this.readUser();

    
    
   
  }
  async readLocations(){
    const {response} = await this.keywordService.getLocationKeywords();
    this.locations = response;
  }

  async readUser(){

  this.currentUser = {...(await this.utilities.getUserData())};

  if ( this.currentUser?.email  !== undefined){

    //@ts-ignore
    if ( this.currentUser?.nick == undefined || this.currentUser?.nick == null){
      this.name = "-";
    } else {
     //@ts-ignore
      this.name = this.currentUser?.nick;
    }

    //@ts-ignore

    if ( this.currentUser?.email === undefined || this.currentUser?.email == null){
      this.email =  null;
    } else {
      //@ts-ignore
      this.email = this.currentUser?.email;
    }

    //@ts-ignore
    if ( this.currentUser?.telefono === undefined || this.currentUser?.telefono == null){
      this.phone = "-";
    } else {
      //@ts-ignore
      this.phone = this.currentUser?.telefono;
    }

  }

  

  }

  onSelectChange($event){
  
    this.error.location = false;
  }
  clearImageByIndex(index: IFile) {
    this.images = this.images.filter(img=> img !== index)
    this.cref.detectChanges()
  }

  fileSelected(iFile: IFile) {
    this.images.push( iFile)
  }

  wysiwygChange(content: iWYSIWYG) {
    this.editorText = content.html;
  }

  cancelNuevoServicio() {
    let url  = '/';
    this.router.navigate([url]);
  }

  async sendServicio(){


      if (  (this.title != undefined && this.title !== null) &&
        (this.editorText != undefined && this.editorText !== null) && 
        (this.name != undefined && this.name !== null) &&
        (this.email != undefined && this.email !== null ) &&
        // (this.selectedValue != undefined && this.selectedValue !== null ) &&
        (this.phone != undefined && this.phone !== null) ){
        this.loadSend = true

        const parser = new DOMParser();
        const doc = parser.parseFromString(this.editorText, 'text/html');

        var productCreate: ISearchFull = {
          title: this.title,
          description: doc.body.textContent,
          images: this.images,
          name: this.name,
          email: this.email,
          phone: this.phone,
          location: this.selectedValue,
        };
    
        const {response, error} = await this.servicesSvc.create(productCreate);

        setTimeout(() => {
          this.loadSend = false
          this.servicioAdded = true;

          setTimeout(() => {
            this.loadSend = false
            this.servicioAdded = false;
            this.servicioFinsish = true;
          
          }, 1000);
        }, 2000);
        
    
        this.images = []
   
       
      } else {
    

        if (  (this.title == undefined || this.title == null || this.title == "") ){
          this.error.title = true;
        }

        if (  (this.editorText == undefined || this.editorText == null || this.editorText == "") ){
          this.error.description = true;
        }

        if (  (this.selectedValue == undefined || this.selectedValue == null || this.selectedValue == "") ){
          this.error.location = true;
        }

        if ( this.currentUser?.email == undefined){

          if (  (this.name == undefined || this.name == null || this.name == "") ){
            this.error.name = true;
          }
  
          if (  (this.email == undefined || this.email == null || this.email == "") ){
            this.error.email = true;
          }
  
          if (  (this.phone == undefined || this.phone == null || this.phone == "") ){
            this.error.phone = true;
          }
        }
        this.loadSend = false
        this.servicioError = true;
        this.servicioAdded = false;

        this.servicioFinsish = false;
       
        
      }
       
  }
    

  closeSearch(){
    this.images = []
    this.isTemplate = false;
    this.servicioAdded = false;

    this.title = null;
    this.description = null;
    this.editorText = null;
    this.name = null;
    this.email = null;
    this.phone = null;
    this.location = null;
    this.selectedValue = null;

  }
  closeServicioError(){
    this.servicioAdded = false;
    this.servicioAddedOther = false;
    this.servicioError = false;
  }

  goToHome(){
    this.router.navigate(['/']);
  }

  gotoSearch(){

    const normalizedString = this.title.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    if (this.title) {
      // You can construct the URL for the new route with the parameters
        const targetRoute = `/listado/${normalizedString}`;
  
        // Use the Router to navigate to the new route
        this.router.navigate([targetRoute]);
      }
  }

}
