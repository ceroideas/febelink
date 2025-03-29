import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { KeywordService } from '../../admin/keyword/services/keyword.service';
import { IHttpService } from '../../services/http.service';
import { SeoService } from '../../services/seo.service';
import { SearchforyouService } from '../../services/searchforyou.service';

import { Keywords } from '../../interfaces/keywords';
import { Employment } from '../../interfaces/employment';
import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';
import { City } from '../../interfaces/city';
import { AskForBudget } from '../../interfaces/ask-for-budget';

import { toSlug } from '../../../utils/utils';
import { ServicesService } from '../servicios/services/services.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss'],
})
export class EmploymentComponent implements OnInit {

  keywords: Keywords | undefined = undefined;

  employments: Employment[] = [];
  provinces: Location[] = [];
  cities: City[] = [];

  requests: AskForBudget[] = [];

  professionQuery: string = '';
  provinceQuery: string = '';
  cityQuery: string = '';

  employment: Employment | undefined = undefined;
  province: Location | undefined = undefined;
  city: City | undefined = undefined;

  isProfessional: boolean = false;
  isAuthenticated: boolean = false;

  actionButton1Text: string = '¡Registrarme ya!';
  actionButton2Text: string = 'Recibe ofertas como estas';

  actionLink: string = '/registro';

  constructor(
    @Inject(PLATFORM_ID) public platformId: Object,
    private actRouter: ActivatedRoute,
    private keywordService: KeywordService,
    private seoService: SeoService,
    private searchForYouService: SearchforyouService,
    private servicesSvc: ServicesService,
    public authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.professionQuery = this.actRouter.snapshot.paramMap.get('profession') || '';
    this.provinceQuery = this.actRouter.snapshot.paramMap.get('province') || '';
    this.cityQuery = this.actRouter.snapshot.paramMap.get('city') || '';

    this.keywordService.getData().then((data: IHttpService) => {
      this.keywords = data.response as Keywords;
      this.employments = data.response.subsector.map((subsector: Subsector) => subsector.employment);
      this.provinces = data.response.locations;
      this.cities = data.response.citys;

      let pageTitle: string = 'Trabajo en Febelink';
      let metaDescription: string = 'Encuentra ofertas de trabajo en Febelink';

      if (this.professionQuery) {
        this.employment = this.employments.find((employment: Employment) => toSlug(employment?.title).toLocaleLowerCase() === this.professionQuery);
        pageTitle = this.employment?.page_title || '';
        metaDescription = this.employment?.meta_description || '';
      }
      if ( this.provinceQuery ) {
        this.province = this.provinces.find((location: Location) => toSlug(location.title).toLocaleLowerCase() === this.provinceQuery);
        pageTitle = this.province?.page_title || '';
        metaDescription = this.province?.meta_description || '';
      }
      if ( this.cityQuery ) {
        this.city = this.cities.find((city: City) => toSlug(city.title).toLocaleLowerCase() === this.cityQuery);
        pageTitle = this.city?.page_title || '';
        metaDescription = this.city?.meta_description || '';
      }

      this.seoService.generateTags({
        title: pageTitle,
        description: metaDescription,
      })

      this.searchForYouService.getAllRequests(this.employment?.id_sub_sector ? [this.employment?.id_sub_sector] : [], this.province?.id ? [this.province?.id] : [])
      .then((data: any) => {
        this.requests = data.response;
      })
      .catch((error) => {
      });
    });
  }

  ngOnInit() {
    if ( isPlatformBrowser(this.platformId) ) {
      if (this.authenticationService.isAuthenticated()) {
        this.isAuthenticated = true;

        this.actionButton1Text = 'Activa tu cuenta profesional';
        this.actionButton2Text = 'Activa tu cuenta profesional';
        this.actionLink = '/professions';

        this.servicesSvc.userProfession()
        .then((data: any) => {
          if (data.response.professions && data.response.professions.length > 0) {
            this.isProfessional = true;
            this.actionButton1Text = 'Ofrece tus servicios';
            this.actionButton2Text = 'Ofrece tus servicios';
            this.actionLink = '/services';
          } 
        })
      }
    }
  }

  goToRegister() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/registro']);
    } else {
      if (this.isProfessional) {
        this.router.navigate(['/services']);
      } else {
        this.router.navigate(['/professions']);
      }
    }
  }
}
