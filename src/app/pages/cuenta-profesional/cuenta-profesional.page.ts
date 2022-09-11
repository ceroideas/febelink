import {Component, OnInit} from '@angular/core';
import {CuentaProfesionalService} from './Services/cuentaProfesionalService.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {AlertController, ModalController, Platform, PopoverController} from '@ionic/angular';
import {UtilitiesService} from '../../services/utilities.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {UserService} from '../../services/user.service';
import {MailService} from '../../services/mail.service';
import {ReportService} from '../../services/report.service';
import {ServicesService} from '../servicios/services/services.service';

@Component({
  selector: 'app-cuenta-profesional',
  templateUrl: './cuenta-profesional.page.html',
  styleUrls: ['./cuenta-profesional.page.scss'],
})
export class CuentaProfesionalPage implements OnInit {
  public checkProfesional: boolean = false;
  public profesionalDatos: any = null;
  public usersArrayFiltered: any = null;
  public searchText: boolean = false;
  public checkMdodel: boolean = null;

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
        this.usersArrayFiltered = this.profesionalDatos;
        this.searchText = true;
      }

    } else {
      this.usersArrayFiltered = null;
      this.searchText = false;
    }

    console.log(this.usersArrayFiltered);
  }

  updatecheckMdodel() {
    console.log('checkModel : ' + this.checkMdodel);
  }

}
