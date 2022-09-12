import {Component, OnInit} from '@angular/core';
import {CuentaProfesionalService} from './Services/cuentaProfesionalService.service';

export interface ProfessionType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cuenta-profesional',
  templateUrl: './cuenta-profesional.page.html',
  styleUrls: ['./cuenta-profesional.page.scss'],
})
export class CuentaProfesionalPage implements OnInit {
  public checkProfesional: boolean = false;
  public profesionalDatos: any = null;
  public usersArrayFiltered: ProfessionType[];
  public searchText: boolean = false;
  public checkMdodel: boolean = null;

  professionList: ProfessionType[] = [];

  public profesiones = [
    'Fisioterapia', 'Radiología'
  ];

  constructor(
    private profAccountService: CuentaProfesionalService) {
  }

  ngOnInit() {
  }

  async changeCheck() {
    this.checkProfesional = !this.checkProfesional;
  }

  async searchProfession(filterTerm: string) {
    if (filterTerm) {
      const {response} = await this.profAccountService.getProfessionsByFilter(filterTerm);
      if (response) {
        this.usersArrayFiltered = response;
        this.searchText = true;
      }
    } else {
      this.usersArrayFiltered = null;
      this.searchText = false;
    }

    console.log(this.usersArrayFiltered);
  }

  addToProfessionList(profession: ProfessionType) {
    this.professionList.push(profession);
  }

  removeOfProfessionList(profession: ProfessionType) {
    const index = this.professionList.indexOf(profession);
    if (index !== -1) {
      this.professionList.splice(index, 1);
    }
  }

  async updateProfessions() {
    const adaptedPayload: number[] = [];
    this.professionList.forEach(elem => {
      adaptedPayload.push(elem.id);
    });
    const {response} = await this.profAccountService.updateProfessions(adaptedPayload);
  }
}
