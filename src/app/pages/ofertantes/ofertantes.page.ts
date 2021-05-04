import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ofertantes',
  templateUrl: './ofertantes.page.html',
  styleUrls: ['./ofertantes.page.scss'],
})
export class OfertantesPage implements OnInit {

  sector: any;
  sectorName: string;
  ofertantes: any = [];
  isLoading: boolean;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private api: ApiService ) { 

    let data:any = route.snapshot.queryParamMap;
    this.sector = data.params.sector;
    this.sectorName = data.params.sector_name;

  }

  ngOnInit() {
    this.getOfertantes();
  }

  async getOfertantes() {

    this.isLoading = true;
    this.ofertantes = [];

    (await this.api.getBiddersByScore( this.sector )).subscribe( ofertantes => {

      console.log("OFERTANTES", ofertantes);

      for (let ofertante of ofertantes) {
        if (ofertante.logo != null) {
          if (!ofertante.logo.includes("http://") && !ofertante.logo.includes("https://"))
            ofertante.logo = `${environment.baseWebUrl}storage/${ofertante.logo}`;
          }
        this.ofertantes.push(ofertante);
      }

      this.isLoading = false;

    });

  }

  /**
   * Ir a un perfil
   */
  public irAPerfil(id): void {
    this.router.navigate(['perfil/'+id],{ queryParams: { 'id_perfil': id , 'contacto': true  }});
  }

}
