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
  public searchText: boolean = false;
  public checkMdodel:boolean = null;

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

  search(query: any) {
    if (query != '') {
      this.usersArrayFiltered = this.profesionalDatos;
      this.searchText = true;
    }else{
      this.usersArrayFiltered = null;
      this.searchText = false;
    } 

    console.log(this.usersArrayFiltered);
  }

  updatecheckMdodel(){
console.log('checkModel : '+this.checkMdodel);
  }

}
