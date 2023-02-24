import { Component, OnInit } from '@angular/core';
import { CuentaProfesionalService } from './Services/cuenta-profesional.service';
import { Subscription } from '../suscripciones/suscripciones.page';
import { SubscriptionService } from '../suscripciones/Services/subscription.service';
import { ToastSvc } from '../../services/toast.service';

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
  numProfessionAvaliable: number = 2;

  constructor(
    private profAccountService: CuentaProfesionalService,
    private subService: SubscriptionService,
    private toastSvc: ToastSvc
  ) {}

  async ngOnInit() {
    await this.getMyProfessions();
    await this.getNumProfessionAvaliables();
  }

  async getMyProfessions() {
    const { response } = await this.profAccountService.getMyProfessions();
    if (response) {
      response.map((e) => {
        this.professionList.push({ id: e.subSectorId, name: e.subSectorName });
      });
      // this.checkProfesional = this.professionList.length > 0;
    }
  }

  async getNumProfessionAvaliables() {
    const { response } = await this.subService.getMySubscriptions();
    if (response) {
      response.forEach((elem: Subscription) => {
        if (elem.subscriptionName === 'sub-pro') {
          this.numProfessionAvaliable += 10;
        }
        if (elem.subscriptionName === 'sub-prof') {
          this.numProfessionAvaliable += elem.amount;
        }
      });
    }
  }

  async changeCheck(checked: boolean) {
    this.checkProfesional = checked;
  }

  async searchProfession(filterTerm: string) {
    if (filterTerm) {
      const { response } = await this.profAccountService.getProfessionsByFilter(
        filterTerm
      );
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

  addToProfessionList(profession: ProfessionType, checked: boolean) {
    if (checked && this.professionList.length <= this.numProfessionAvaliable) {
      this.professionList.push(profession);
    } else {
      const index = this.professionList.indexOf(profession);
      if (index >= 0) {
        this.professionList.splice(index, 1);
      }
    }
  }

  removeOfProfessionList(profession: ProfessionType) {
    const index = this.professionList.indexOf(profession);
    if (index !== -1) {
      this.professionList.splice(index, 1);
    }
  }

  async updateProfessions() {
    const adaptedPayload: number[] = [];
    this.professionList.forEach((elem) => {
      adaptedPayload.push(elem.id);
    });
    const { response } = await this.profAccountService.updateProfessions(
      this.professionList
    );
    if (response) {
      this.toastSvc.show('Profesiones actualizadas correctamente.');
    }
  }

  isInProfessionList(profession: ProfessionType): boolean {
    return (
      this.professionList.find((prof) => {
        return prof.id === profession.id && prof.name === profession.name;
      }) != undefined
    );
  }
}
