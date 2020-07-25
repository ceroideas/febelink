import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.page.html',
  styleUrls: ['./busquedas.page.scss'],
})
export class BusquedasPage implements OnInit {

  settingsDemandas: string = "demandasPage"; // default button
  perfil:any;
  demandas: any;
  misDemandas: any;
  isLoading: boolean;

  constructor( private api: ApiService ) { 

    this.settingsDemandas = 'demandasPage';
    this.isLoading = true;

  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.obtenerDemandas();
  }

  async obtenerDemandas() {
   
      this.demandas = [];
      (await this.api.demandasRecibidas()).subscribe( demandas => {

        demandas = demandas.filter( demanda => demanda.id_demandante !== this.perfil.id );
        for (let demanda of demandas) {
          if (demanda.imagen != null) {
            if (!demanda.imagen.includes("http://") && !demanda.imagen.includes("https://")){
              demanda.imagen = "https://api.febelink.com/storage/" + demanda.imagen;
            }
          }
          this.demandas.push(demanda);
        }
  
        console.log("DEMANDAS",this.demandas);
        this.isLoading = false;

      });

  }

}
