import { Component, OnInit, OnChanges, Input, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {  
  
  @Input() qPages: number = 0;
  @Input() totalRecords: number = 0;
  @Input() recordsPerPage: number = 0;
  @Input() activePage: number = 1;
  @Input() maxPages: number = 4;
  @Input() disabled: boolean = false;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();  

  public pages: number[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): any {
    this.pages = this.getArrayOfPage();
  }

  private getArrayOfPage(): number [] {  
    const pageArray = [];  

    if ( this.qPages > 0 ) {
        // To not to show more pages than max Pages.
        let nbr = this.qPages < this.maxPages ? 1 : Math.floor( this.activePage / 2 );
        nbr = Math.max( 1, nbr );
        for( let i = nbr ; i <= Math.min( this.maxPages + nbr, this.qPages ) ; i++ ) {  
          pageArray.push(i);  
        }  
    }  

    return pageArray;  
  } 

  onClickPage(pageNumber: number): void {  
      if ( pageNumber >= 1 && pageNumber <= this.qPages ) {
          this.activePage = pageNumber;  
          this.onPageChange.emit(this.activePage);  
      }  
  }

  update( response ) {
    this.totalRecords = response?.totalRecords;
    this.recordsPerPage = response?.limit;
    this.qPages = response?.qPages;
  }
}
