import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CuentaProfesionalService } from './Services/cuenta-profesional.service';
import { Subscription } from '../suscripciones/suscripciones.page';
import { SubscriptionService } from '../suscripciones/Services/subscription.service';
import { ToastSvc } from '../../services/toast.service';
import { KeywordService } from '../../admin/keyword/services/keyword.service';
import { AlertSvc } from '../../services/alert.service';
import { IHttpService } from '../../services/http.service';
import { Keywords } from '../../interfaces/keywords';
import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';

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
  numProfessionAvaliable: number = 2;

  isProfessional: boolean = false;

  allProvinces: Location[] = [];
  allSubsectors: Subsector[] = [];
  myProvinces: {location: Location | undefined, city: string}[] = [];
  mySubsectors: Subsector[] = [];

  province: number | string | undefined = undefined;
  city: string = '';
  subsector: number | string | undefined = undefined;

  constructor(
    private profAccountService: CuentaProfesionalService,
    private subService: SubscriptionService,
    private toastSvc: ToastSvc,
    public alertSvc: AlertSvc,
    private keywordService: KeywordService,
    private crdef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.getNumProfessionAvaliables();

    this.keywordService.getData()
    .then((data: IHttpService) => {
      const aux = (data.response as Keywords);
      const provinces = aux.locations
        .filter((location: Location) =>  location.title !== 'España')
        .sort((a: Location, b: Location) => a.title.localeCompare(b.title));
      const subsectors = aux.subsector.sort((a: Subsector, b: Subsector) => a.nombre.localeCompare(b.nombre));

      this.allProvinces = provinces;
      this.allSubsectors = subsectors;

      // Get professions
      this.profAccountService.getMyProfessions()
      .then(async (data: any) => {
        const result = data.response;
        const myProfessions = result.professions;
        const myLocations = result.locations;

        console.log(myProfessions, myLocations);
        
        if ( !myProfessions.length && !myLocations.length ) {
          this.isProfessional = false;
        } else {
          this.isProfessional = true;

          this.myProvinces = myLocations.map((location: any) => ({ location: provinces.find((l: Location) => l.id === location.locationId), city: location.city }));
          this.mySubsectors = myProfessions.map((profession: any) => subsectors.find((s: Subsector) => s.id === profession.subSectorId));
        }
      });
    });
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

        console.log(this.numProfessionAvaliable);
      });
    }
  }

  addLocation = () => {
    console.log
    if (this.province && this.city) {
      this.myProvinces = [...this.myProvinces, { location: this.allProvinces.find((location) => location.id === Number(this.province)), city: this.city }]
      
      this.saveProfessionalAccount(this.isProfessional, this.myProvinces, this.mySubsectors);
      
      this.province = undefined;
      this.city = '';
    }
  }
  deleteLocation = (index: number) => {
    this.myProvinces = this.myProvinces.filter((_, i) => i !== index);
    this.saveProfessionalAccount(this.isProfessional, this.myProvinces, this.mySubsectors);
  }

  addSubsector = () => {
    if (this.subsector) {
      const found = this.allSubsectors.find((s) => s.id === Number(this.subsector));

      if ( found ) {
        this.mySubsectors = [...this.mySubsectors, found]

        this.saveProfessionalAccount(this.isProfessional, this.myProvinces, this.mySubsectors);
        
        this.subsector = undefined;
      }
    }
  }
  deleteSubsector = (index: number) => {
    this.mySubsectors = this.mySubsectors.filter((_, i) => i !== index);
    this.saveProfessionalAccount(this.isProfessional, this.myProvinces, this.mySubsectors);
  }

  onToggleProfessional = () => {
    this.saveProfessionalAccount(this.isProfessional, this.myProvinces, this.mySubsectors);
  }

  saveProfessionalAccount = (newStatus: boolean, newLocations: {location: Location | undefined, city: string}[], newProfessions: (Subsector | undefined)[]) => {
    if ( !newStatus ) {
      this.profAccountService.updateProfessions([], []).then();
    } else {
      const parsedLocations = newLocations.map((location) => ({ locationId: location.location?.id, location: location.location?.title, city: location.city }));
      const parsedProfessions = newProfessions.map((profession) => ({ id: profession?.id, name: profession?.nombre }));
      this.profAccountService.updateProfessions(parsedProfessions, parsedLocations).then();
    }
  }
}
