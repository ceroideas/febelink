import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(public searchService: SearchService) {
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
