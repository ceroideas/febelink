import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FilePickType,
  IFile,
} from '../../components/file-picker/models/file.model';
import {iWYSIWYG} from './../../components/wysiwyg/models/wysiwyg.model';
import { ISearchFull } from './models/lo-buscamos-por-ti.model';
import { SearchforyouService } from './../../services/searchforyou.service';
import { KeywordService } from './../../admin/keyword/services/keyword.service';
import { ApiService } from './../../services/api.service';
import { IUser } from './../../models/user.model';
import { UtilitiesService } from './../../services/utilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart/services/cart.service';
@Component({
  selector: 'app-lo-buscamos-por-ti',
  templateUrl: './lo-buscamos-por-ti.page.html',
  styleUrls: ['./lo-buscamos-por-ti.page.scss'],
})
export class LoBuscamosPorTiPage implements OnInit {

  //@ts-ignore
  iFile: IFile ;
  filePickType = FilePickType;

  error: any = {}

  servicioFinsish: boolean = false;
  servicioAdded: boolean = false;
  servicioError: boolean = false;
  servicioAddedOther: boolean = false;
  loadSend: boolean = false;
  title: string = ""
  description: string = ""
  name: string = ""
  email: string = ""
  phone: string = ""
  location: string = ""

  images: IFile[] = [];

  editorText: string =""
  isTemplate: boolean = false;
  disabled: boolean = false;
  locations: any = [];
  peticions: any = {}
  selectedValue: any;
  currentUser: any = {
    nick: null,
    email: null,
    telefono: null
  }
  //@ts-ignore
  id;
  constructor(  private router: Router, private route: ActivatedRoute,  private utilities: UtilitiesService,  
    public cartSvc: CartService,
    private api: ApiService, private keywordService: KeywordService, private modalCtrl: ModalController,  public servicesSvc: SearchforyouService,  public cref: ChangeDetectorRef ) { 
    this.route.fragment.subscribe(fragment => {
      if (!!fragment) {
          // Check if 'search' property exists in 'fragment' object
          if (fragment.hasOwnProperty('search')) {
              try {
                //@ts-ignore
                  const jsonObject = JSON.parse(fragment.search);
                  // Retrieve the value of the 'title' property
                  const title = jsonObject.title;
                  this.title = title;
              } catch (error) {
                  console.error('Error parsing JSON:', error);
              }
          } else {
              console.error('Fragment does not contain the "search" property.');
          }
      }
    });
    this.id = this.route.snapshot.paramMap.get('id') || ''

    this.route.queryParams.subscribe(params => {
      if ( params['query'] ) {
        this.title = decodeURIComponent(params['query']);
      }
    }); 
   
    if ( this.id !== ''){
        this.getfindServices()
    }
  }

  ngOnInit() {
    this.readLocations()
    this.readUser();
  }

  async getfindServices() {
    this.cartSvc.getFindService(this.id).then(async (data: any) => {
      this.peticions = data.response;
      this.title = data.response.title
      this.description = data.response.description
      this.images = data.response.images
      this.location = data.response.location

      this.isTemplate = true
     })
    
  }
  async readLocations(){

    this.keywordService.getLocationKeywords().then(async (data: any) => {
      this.locations = data.response;
    })


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
      this.email =  "";
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
  onSelect(hero: any): void {
    console.log(hero)
  }
  onSelectChange($event: any){
  
    this.error.location = false;
  }
  clearImageByIndex(index: any) {
    this.images = this.images.filter(img=> img !== index)
    this.cref.detectChanges()
  }

  fileSelected(iFile: IFile) {
    this.images.push( iFile)
  }

  wysiwygChange(content: iWYSIWYG) {
    //@ts-ignore
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
          //@ts-ignore
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
    
  finish(){
    this.servicioAdded = false;
    this.servicioFinsish = true;
  }

  closeSearch(){
    this.images = []
    this.isTemplate = false;
    this.servicioAdded = false;
    this.servicioFinsish = false;

    this.title = "";
    this.description = "";
    this.editorText = "";
    this.name = "";
    this.email = "";
    this.phone = "";
    this.location = "";
    this.selectedValue = null;

    window.scrollTo(0, 0);

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
        const targetRoute = `/servicios/${normalizedString}`;
  
        // Use the Router to navigate to the new route
        this.router.navigate([targetRoute]);
      }
  }

}
