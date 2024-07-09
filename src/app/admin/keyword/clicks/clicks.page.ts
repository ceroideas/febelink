import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AlertSvc} from '../../../services/alert.service';
import {LoadingSvc} from '../../../services/loading.service';
import {ToastSvc} from '../../../services/toast.service';
import {KeywordService} from '../services/keyword.service';
import { Router } from '@angular/router';

interface SectorKeys {
  id: number,
  sector_id: number,
  key_name: string,
  nombre: string,
  link: string,
  icons: string,
  isEdit: boolean
}

@Component({
  selector: 'clicks-page',
  templateUrl: './clicks.page.html',
  styleUrls: ['./clicks.page.scss'],
})

export class ClicksPage implements OnInit {

  isLoading: boolean = false;
  //@ts-ignore
  sectorKeys: SectorKeys[];
  profiles: any = [];
  publications: any = [];
    //@ts-ignore
  sectorKeys_filtered: SectorKeys[];
    //@ts-ignore
  filter: string;

  showCreatekeyword: boolean = false;

  isProfile: boolean = true;
  isPublications: boolean = false;
  constructor(
    public alertSvc: AlertSvc,
    public toastSvc: ToastSvc,
    public loadingSvc: LoadingSvc,
    private keywordService: KeywordService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // this.sectors = await this.sectorService.get();
    this.search();
  }

  async search(event?: any) {
    this.isLoading = true;
    // this.filter = event?.target?.value || this.filter || '';
    this.keywordService.listClickViews().then(async (response: any) => {
      console.log(response.response)
      this.profiles = response.response.profile;
      this.publications = response.response.publication;
      this.isLoading = false;
    })
  }

  search_filter(event?: any){
    this.sectorKeys = this.sectorKeys_filtered;
    this.filter = event?.target?.value;
    if ( this.filter !== '' && this.filter !== undefined && this.filter !== null){
      this.sectorKeys = this.sectorKeys.filter((sector: any) => {
        if ( sector?.link !== '' && sector?.link !== undefined && sector?.link !== null){
          return sector?.link?.toLowerCase().includes(this.filter.toLowerCase());
        }
      })
    } else {
      this.sectorKeys = this.sectorKeys_filtered;
    }
  }

  removeAccents(inputString:any) {
    // Normalize accented characters to their base form
    const normalizedString = inputString?.normalize("NFD").replace(/[\u0300-\u036f&&[^\u00f1]]/g, "");
    return normalizedString;
  }

  showPublication(key:any){
    let keywordParse;
    keywordParse = key.title.replace(new RegExp(' ', 'g'), '-').toLowerCase();
    keywordParse= this.removeAccents(keywordParse)
    
    this.router.navigate([`servicio/${keywordParse}/detail/${key.product}`])
  }
  showProfile(key:any){
    this.router.navigate([`user/${key.nick}/detail/${key.profile}`])
  }

  
  /* Pagination */
  totalRecords: number = 0;
  recordsPerPage: number = 1;
  qPages: number = 1;
  activePage: number = 1;

  displayActivePage(activePage: number) {
    this.activePage = activePage;
    this.search();
  }


}
