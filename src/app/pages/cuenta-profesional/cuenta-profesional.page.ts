import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CuentaProfesionalService } from './Services/cuenta-profesional.service';
import { Subscription } from '../suscripciones/suscripciones.page';
import { SubscriptionService } from '../suscripciones/Services/subscription.service';
import { ToastSvc } from '../../services/toast.service';
import { KeywordService } from '../../admin/keyword/services/keyword.service';
import { AlertSvc } from '../../services/alert.service';
import { getWindow } from 'ssr-window';

export interface ProfessionType {
  id: number;
  name: string;
 
}

export interface locationType {
  locationId?: number;
  location?: string,
  city?: string,

}
@Component({
  selector: 'app-cuenta-profesional',
  templateUrl: './cuenta-profesional.page.html',
  styleUrls: ['./cuenta-profesional.page.scss'],
})
export class CuentaProfesionalPage implements OnInit {
  public checkProfesional: boolean = false;
  public profesionalDatos: any = null;
  public usersArrayFiltered: ProfessionType[] |undefined;
  public searchText: boolean = false;
  public checkMdodel: boolean = false;

  professionList: ProfessionType[] = [];
  locationsProfessions: locationType[] = [];
  numProfessionAvaliable: number = 2;

  locations: any = []
  locationSelect: number = 0
  city: string = ""
  locationSelectName: string = ""
  profession_aux: any

  window = getWindow();
  constructor(
    private profAccountService: CuentaProfesionalService,
    private subService: SubscriptionService,
    private toastSvc: ToastSvc,
    public alertSvc: AlertSvc,
    private keywordService: KeywordService,
    private crdef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.locationsProfessions = []
    this.locations= []

    this.keywordService.getLocationKeywords().then((response: any) => {
      this.locations =response.response;

      this.locations = response.response
      .filter((location_aux: any) =>  location_aux.title !== 'España')
      .map((location_aux: any) => {
        return location_aux
      });



      let allLocation = response.response
      .filter((location_aux: any) =>  location_aux.title == 'España')
      .map((location_aux: any) => {
        return location_aux
      })[0];

      this.locations.unshift(allLocation)


    })
    await this.getMyProfessions();
    await this.getNumProfessionAvaliables();

  }

  async getMyProfessions() {
    this.locationsProfessions = []
    const { response } = await this.profAccountService.getMyProfessions();
    if (response) {
      
      response.professions.map((e:any) => {
        this.professionList.push({ id: e.subSectorId, name: e.subSectorName });
      });
    
      response.locations.map((location:any) => {


        
        this.locationsProfessions.push({ locationId:location.locationId, location: location.location, city: location.city });
      });
    }
    
  }

  onSelectChange($event: any){
    this.locationSelect  = $event.target.value

    

    let location = this.locations.filter((location:any)=> location.id === Number(this.locationSelect))[0];
    this.locationSelectName  = location.title
  }

  async getNumProfessionAvaliables() {
    const { response } = await this.subService.getMySubscriptions();
    if (response) {
      response.forEach((elem: Subscription) => {
        if (elem.subscriptionName === 'sub-pro') {
          this.numProfessionAvaliable = 3;
        }
        if (elem.subscriptionName === 'superpro') {
          this.numProfessionAvaliable = 5;
        }
        if (elem.subscriptionName === 'sub-prof') {
          this.numProfessionAvaliable += elem.amount;
        }
      });
    }
  }

  async changeCheck(checked: boolean) {
    this.checkProfesional = checked;
  }

  async searchProfession(filterTerm: string) {
    if (filterTerm) {
      const { response } = await this.profAccountService.getProfessionsByFilter(
        filterTerm
      );

      if (response) {
        this.usersArrayFiltered = response;
        this.searchText = true;
      }
    } else {
      
      this.usersArrayFiltered = undefined;
      this.searchText = false;
    }
  }

  async addToProfessionList(profession: ProfessionType, checked: boolean) {
   
   
      if (checked && this.professionList.length <= this.numProfessionAvaliable) {
        this.profession_aux = profession
        this.professionList.push(this.profession_aux);
  
      } else {
        const index = this.professionList.indexOf(profession);
        if (index >= 0) {
          this.professionList.splice(index, 1);
        }
      }
    
    
  }

  removeOfProfessionList(profession: ProfessionType) {
    const index = this.professionList.indexOf(profession);
    if (index !== -1) {
      this.professionList.splice(index, 1);
    }
  }

  removeOfProfessionLocationList(location: locationType){
    const index = this.locationsProfessions.indexOf(location);
    if (index !== -1) {
      this.locationsProfessions.splice(index, 1);
    }
  }


  addProffession(){
    this.professionList.push(this.profession_aux);

    this.usersArrayFiltered = undefined;
    this.searchText = false;
  }



  async addLocation(){

    if ( this.locationSelectName !== 'España' && this.city !== '' ) {
      let citySelect = JSON.parse(JSON.stringify(this.city))
      let locationSelect = JSON.parse(JSON.stringify(this.locationSelect))
      let locationSelectName = JSON.parse(JSON.stringify(this.locationSelectName))
      this.locationsProfessions.push({locationId:locationSelect,location:locationSelectName,city:citySelect});
      this.city = ""
      this.locationSelect = 0
      this.locationSelectName = ""
      this.crdef.detectChanges()
    
    } else if ( this.locationSelectName == 'España' ) {
      let citySelect = JSON.parse(JSON.stringify(this.city))
      let locationSelect = JSON.parse(JSON.stringify(this.locationSelect))
      let locationSelectName = JSON.parse(JSON.stringify(this.locationSelectName))
      this.locationsProfessions.push({locationId:locationSelect,location:locationSelectName,city:citySelect});
      this.city = ""
      this.locationSelect = 0
      this.locationSelectName = ""
      this.crdef.detectChanges()
    } else {
      if (!await this.alertSvc.confirm({
        title: 'Formulario Incompleto',
        msg: `Rellena una provincia y una ciudad para las profesiones`
      })) {
        return; // Cancel button
      }
    }
    
    

  }
  async updateProfessions() {

    const adaptedPayload: number[] = [];
    this.professionList.forEach((elem) => {
      adaptedPayload.push(elem.id);
    });


    const adaptedPayloadLocation: number[] = [];
    this.locationsProfessions.forEach((elem) => {
      //@ts-ignore
      adaptedPayloadLocation.push(elem.locationId);
    });
    const { response } = await this.profAccountService.updateProfessions(
      this.professionList, 
      this.locationsProfessions
    );
    if (response) {
      this.toastSvc.show('Profesiones actualizadas correctamente.');

      // this.window.location.reload();
    }
  }

  isInProfessionList(profession: ProfessionType): boolean {
    return (
      this.professionList.find((prof) => {
        return prof.id === profession.id && prof.name === profession.name;
      }) != undefined
    );
  }
}
