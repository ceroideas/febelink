import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/tab1/search/services/search.service';

@Component({
  selector: 'app-detalle-busqueda',
  templateUrl: './detalle-busqueda.page.html',
  styleUrls: ['./detalle-busqueda.page.scss'],
})
export class DetalleBusquedaPage implements OnInit {

  public detalle: any;
  public data: any;
  
  slideOpts = {
    initialSlide: 1
  };

  constructor(public searchService: SearchService) { }


  ngOnInit() {
    this.searchService.getDetalle(this.detalle)
    .then(res => {
        this.detalle = res;
    }).catch(err => {
        console.log(err);
    }); 
  }
}
