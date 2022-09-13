import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {SearchService} from '../../services/search.service';
import {IKeywords} from '../../models/search.model';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  public data: any;
  @Input() type: string = '';


  public slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  recommendations;
  searchResponse;
  unitTypes = [
    {id: 1, name: 'Día', shorthand: 'día', lang: 'ES'},
    {id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES'},
    {id: 3, name: 'Año', shorthand: 'año', lang: 'ES'},
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'}
  ]; // ToDo: Get this from the priceType Collection

  constructor(public searchService: SearchService,
              private router: Router) {
    this.type = 'resultado';
  }

  ngOnInit() {
    this.getRecommendations();
    /*this.searchService.getData()
    .then(res => {
        this.data = res;
    }).catch(err => {
        console.log(err);
    }); */
  }

  segmentChanged(event) {
    console.log(event);
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  getR() {
    return this.searchService.getResult();
  }

  getOf() {
    return this.searchService.getOffers();
  }

  getL() {
    return this.searchService.getList();
  }

  text(text?: string): string {
    if (text != undefined) {
      this.searchText = text;
    }
    return this.searchText || '';
  }

  clear() {
    this.searchText = '';
  }

  async getRecommendations() {
    const {response} = await this.searchService.getRecommendations();
    if (response) this.recommendations = response;
  }

  async search() {
    const {response} = await this.searchService.getProfessionsByFilter(this.searchText);
    if (response) {
      const bestProfessionMatch = response[0];
      if (bestProfessionMatch) {
        const {response} = await this.searchService.search(bestProfessionMatch);
        this.searchResponse = response;
      }
    }
  }
}
