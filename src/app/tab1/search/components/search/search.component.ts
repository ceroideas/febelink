import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { SearchService } from '../../services/search.service';
import { IKeywords } from '../../models/search.model';


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
  
  constructor(public searchService: SearchService,
              private router: Router) {
    this.type = "resultado";
  }

  ngOnInit() {
    this.searchService.getData()
    .then(res => {
        this.data = res;
    }).catch(err => {
        console.log(err);
    }); 
  }

  segmentChanged(event){
    console.log(event);
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  getR(){
    return this.searchService.getResult();
  }

  getOf(){
    return this.searchService.getOffers();
  }

  getL(){
    return this.searchService.getList();
  }

  text(text?: string): string {
    if (text != undefined){
        this.searchText = text;
    } 
    return this.searchText || '';
  }

  clear() {
    this.searchText = '';
  }
}
