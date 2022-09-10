import { Component, OnInit } from '@angular/core';
import { CuentaProfesionalService } from './Services/cuentaProfesionalService.service';

@Component({
  selector: 'app-cuenta-profesional',
  templateUrl: './cuenta-profesional.page.html',
  styleUrls: ['./cuenta-profesional.page.scss'],
})
export class CuentaProfesionalPage implements OnInit {
  public checkProfesional: boolean = false;
  public geoDatas: any = null;
  public profesionalDatos: any = null;
  public usersArrayFiltered: any = null;

  constructor(private cuentaProfesionalService: CuentaProfesionalService) { }

  ngOnInit() {
    this.getTypeGeo();
    this.getProfesiones();
  }

  async changeCheck(){
    this.checkProfesional = !this.checkProfesional;
  }

  getTypeGeo(){
    let id = 1;
    this.cuentaProfesionalService.getTypeGeo(id)
    .then(res => {
      this.geoDatas = res;
      console.log(this.geoDatas);
    })
    .catch(err => {
      console.log(err);
    })
  }

  getProfesiones(){
    let id = 1;
    this.cuentaProfesionalService.getProfesiones(id)
    .then(res => {
      this.profesionalDatos = res;
      console.log(this.profesionalDatos);
    })
    .catch(err => {
      console.log(err);
    })
  }

  search(query: any, geoId: number) {
    let select_geo = null;
    if (!query) { // revert back to the original array if no query
      this.usersArrayFiltered = this.profesionalDatos?.profesiones;
    } else { // filter array by query
      this.usersArrayFiltered = this.profesionalDatos?.profesiones.filter((profesion) => {
        return profesion.texto.includes(query);
        
      })
    }
  }

}
