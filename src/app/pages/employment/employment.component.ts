import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { KeywordService } from '../../admin/keyword/services/keyword.service';
import { IHttpService } from '../../services/http.service';
import { SeoService } from '../../services/seo.service';

import { Keywords } from '../../interfaces/keywords';
import { Employment } from '../../interfaces/employment';
import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';
import { City } from '../../interfaces/city';
import { toSlug } from '../../../utils/utils';

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

  professionQuery: string = '';
  provinceQuery: string = '';
  cityQuery: string = '';

  employment: Employment | undefined = undefined;
  province: Location | undefined = undefined;
  city: City | undefined = undefined;

  constructor(
    private actRouter: ActivatedRoute,
    private keywordService: KeywordService,
    private seoService: SeoService
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
        this.employment = this.employments.find((employment: Employment) => toSlug(employment.title).toLocaleLowerCase() === this.professionQuery);
        pageTitle = `Trabajos de ${this.employment?.title} en Febelink`;
        metaDescription = this.employment?.meta_description || '';
      }
      if ( this.provinceQuery ) {
        this.province = this.provinces.find((location: Location) => toSlug(location.title).toLocaleLowerCase() === this.provinceQuery);
        pageTitle = `Trabajos de ${this.employment?.title} en ${this.province?.title}`;
        metaDescription = `Encuentra ofertas de trabajo de ${this.employment?.title} en ${this.province?.title}`; 
      }
      if ( this.cityQuery ) {
        this.city = this.cities.find((city: City) => toSlug(city.title).toLocaleLowerCase() === this.cityQuery);
        pageTitle = `Trabajos de ${this.employment?.title} en ${this.city?.title}`;
        metaDescription = `Encuentra ofertas de trabajode ${this.employment?.title} en ${this.city?.title}`;
      }

      this.seoService.generateTags({
        title: pageTitle,
        description: metaDescription,
      })
    });
  }

  ngOnInit() {}

}
