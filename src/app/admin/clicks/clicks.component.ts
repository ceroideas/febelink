import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { Sector as LegacySector, KeySearch as LegacyKeySearch } from '../../interfaces/sector';

import { toSlug } from '../../../utils/utils';

interface KeySearch extends LegacyKeySearch {
  removed?: boolean;
}
interface Sector extends LegacySector {
  keySearch: KeySearch[];
  selected?: boolean;
  iconError?: boolean;
  isNew?: boolean;
  keyWords?: string;
}

@Component({
  selector: 'app-clicks',
  templateUrl: './clicks.component.html'
})
export class ClicksComponent implements OnInit {

  profilesWhatsappClicks: any = [];
  profilesViews: any = [];
  publicationsWhatsappClicks: any = [];
  publicationsViews: any = [];
  filteredProfilesWhatsappClicks: any[] = [];
  filteredProfilesViews: any[] = [];
  filteredPublicationsWhatsappClicks: any[] = [];
  filteredPublicationsViews: any[] = [];

  totalProfileWhatsappClicks: number = 0;
  totalProfileViews: number = 0;
  totalPublicationWhatsappClicks: number = 0;
  totalPublicationViews: number = 0;

  loading: boolean = false;

  currentFilter: string = '';

  activeTab: 'profilesWhatsapp' | 'publicationsWhatsapp' | 'profilesViews' | 'publicationsViews' = 'profilesWhatsapp';

  toSlug = toSlug;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private keywordService: KeywordService,
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(refresh: boolean = false) {
    !refresh && (this.loading = true);

    this.keywordService.listClickViews().then(async (response: any) => {
      this.profilesWhatsappClicks = [...response.response.profile.sort((a: any, b: any) => b.numProfile - a.numProfile)];
      this.publicationsWhatsappClicks = [...response.response.publication.sort((a: any, b: any) => b.numPublication - a.numPublication)];
      this.profilesViews = [...response.response.profile.sort((a: any, b: any) => b.views - a.views)];
      this.publicationsViews = [...response.response.publication.sort((a: any, b: any) => b.views - a.views)];
      
      this.filter({ target: { value: this.currentFilter } });

      this.totalProfileWhatsappClicks = this.profilesWhatsappClicks.reduce((acc: number, profile: any) => acc + profile.numProfile, 0);
      this.totalProfileViews = this.profilesViews.reduce((acc: number, profile: any) => acc + profile.views, 0);
      this.totalPublicationWhatsappClicks = this.publicationsWhatsappClicks.reduce((acc: number, publication: any) => acc + publication.numPublication, 0);
      this.totalPublicationViews = this.publicationsViews.reduce((acc: number, publication: any) => acc + publication.views, 0);

      this.loading = false;
    })
    .catch((error) => {
      this.loading = false;
    });
  }

  getSubsectors() {
    return this.keywordService.getSubSectorAll()
    .then((data: any) => {
      return data;
    })
    .catch((error) => {
      this.loading = false;
    });
  }

  filter(event: any) {
    const value = event.target.value;
    this.currentFilter = value;
    this.filteredProfilesWhatsappClicks = this.profilesWhatsappClicks.filter((profile: any) => 
      profile.nick?.toLowerCase().includes(value.toLowerCase())
    );
    this.filteredProfilesViews = this.profilesViews.filter((profile: any) => 
      profile.nick?.toLowerCase().includes(value.toLowerCase())
    );
    this.filteredPublicationsWhatsappClicks = this.publicationsWhatsappClicks.filter((publication: any) => 
      publication.title?.toLowerCase().includes(value.toLowerCase())
    )
    this.filteredPublicationsViews = this.publicationsViews.filter((publication: any) => 
      publication.title?.toLowerCase().includes(value.toLowerCase())
    )
  }

  showProfile(key: any){
    const url = this.router.serializeUrl(this.router.createUrlTree([`user/${key.nick}/detail/${key.profile}`], {}));
    window.open(url, '_blank');
  }
  showPublication(key: any){
    let keywordParse;
    keywordParse = toSlug(key.title);
    const url = this.router.serializeUrl(this.router.createUrlTree([`servicio/${keywordParse}/detail/${key.product}`], {}));
    window.open(url, '_blank');
  }
}
