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
@Component({
  selector: 'app-lo-buscamos-por-ti',
  templateUrl: './lo-buscamos-por-ti.page.html',
  styleUrls: ['./lo-buscamos-por-ti.page.scss'],
})
export class LoBuscamosPorTiPage implements OnInit {

  iFile: IFile;
  filePickType = FilePickType;

  error: any = {}

  servicioAdded: boolean = false;
  servicioError: boolean = false;

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
  constructor( private keywordService: KeywordService, private modalCtrl: ModalController,  public servicesSvc: SearchforyouService,  public cref: ChangeDetectorRef ) { }

  ngOnInit() {
    this.readLocations()
  }
  async readLocations(){
    const {response} = await this.keywordService.getLocationKeywords();
    this.locations = response;
  }

  onSelectChange($event){
    console.log($event)
    console.log(this.selectedValue)
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
  }

  async sendServicio(){

      if (  (this.title != undefined && this.title !== null) &&
        (this.editorText != undefined && this.editorText !== null) && 
        (this.name != undefined && this.name !== null) &&
        (this.email != undefined && this.email !== null ) &&
        (this.selectedValue != undefined && this.selectedValue !== null ) &&
        (this.phone != undefined && this.phone !== null) ){
         
        var productCreate: ISearchFull = {
          title: this.title,
          description: this.editorText,
          images: this.images,
          name: this.name,
          email: this.email,
          phone: this.phone,
          location: this.selectedValue,
        };
    
        const {response, error} = await this.servicesSvc.create(productCreate);
    
    
   
        this.title = null;
        this.description = null;
        this.name = null;
        this.email = null;
        this.phone = null;
        this.location = null;
      
        this.isTemplate = false;
      } else {
    
        this.servicioError = true;
        this.servicioAdded = false;
       
        
      }
       
  }
    

  closeSearch(){
    this.images = []
    this.title = null;
    this.description = null;
    this.name = null;
    this.email = null;
    this.phone = null;
    this.location = null;
  
    this.isTemplate = false;
    this.servicioAdded = false;
  }
  closeServicioError(){
    this.servicioAdded = false;
    this.servicioError = false;
  }

}
