import { ToastSvc } from 'src/app/services/toast.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SubsectorService } from 'src/app/components/sectors/services/subsectores.service';
import { ISubSector } from 'src/app/models/sector.model';
import { AlertSvc, IAlert } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LoadingSvc } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { AssistantSearchComponent } from '../components/search/search.component';
import { IForm, IKeywords } from '../models/assistant.model';
import { ApiService } from 'src/app/services/api.service';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';
import { IUser } from 'src/app/models/user.model';
import { AssistantSearchSvc } from '../services/assistant-search.service';

@Component({
  selector: 'app-assistant-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class AssistantPopComponent implements OnInit {
  @Input() iKeywords: IKeywords = {
    selectorEnabled: false,
  };
  @Input() searchText: string = '';

  @Input() id_sector: number;
  @Input() sector: string;

  @Input() id_subsector: number;
  @Input() subsector: string;

  @Input() subsectors: ISubSector[];

  @Input() perfil: IUser;

  @ViewChild('search') searchComponent: AssistantSearchComponent;

  isLoading: boolean = false;

  constructor(
    private popCrtl: PopoverController,
    private alertSvc: AlertSvc,
    private subsectorSvc: SubsectorService,
    private authSvc: AuthenticationService,
    private userSvc: UserService,
    private loadingSvc: LoadingSvc,
    private toastSvc: ToastSvc,
    private apiSvc: ApiService,
    private translateSvc: TranslateConfigService,
    public assistantSearchSvc: AssistantSearchSvc
  ) {
    console.log(
      'Testeo la inicialización de KEYS: ',
      this.assistantSearchSvc.keys()
    );
  }

  ngOnInit() {}

  ngAfterContentInit() {
    if (!this.id_subsector) this.getSubsectors();
  }

  back() {
    if (this.id_subsector) {
      this.id_subsector = null;
      this.subsector = null;
    } else if (this.id_sector) {
      this.id_sector = null;
      this.sector = null;
    } else this.dismiss();
  }

  dismiss(data: any = {}) {
    this.popCrtl.dismiss(data);
  }

  getSubsectors() {
    this.isLoading = true;
    this.subsectorSvc.get(this.id_sector).then((subsectors) => {
      console.log({ subsectors });
      this.subsectors = subsectors;
      this.isLoading = false;
    });
  }

  clearSector() {
    this.clearSubsector();
    this.id_sector = null;
    this.sector = null;
  }
  clearSubsector() {
    this.id_subsector = null;
    this.subsector = null;
  }

  OnGotKeys(data) {
    this.id_sector = data?.sector_id;
    this.sector = data?.sector_nombre;

    this.id_subsector = data?.subsector_id;
    this.subsector = data?.subsector_nombre;
    this.getSubsectors();
  }

  OnSubsectorSelected(subsector: ISubSector) {
    this.id_subsector = subsector.id;
    this.subsector = subsector.nombre;
  }

  async publish(iForm: IForm) {
    if (!this.perfil) {
      this.authSvc.userNeedsToRegister();
      return;
    }

    if (this.userSvc.checkUserDataComplete(this.perfil)) {
      this.loadingSvc.show();

      (
        await this.apiSvc.publicarDemanda(
          this.searchText,
          iForm.descript,
          this.id_sector,
          this.id_subsector,
          iForm.ofertas_restantes,
          iForm.file?.src
        )
      ).subscribe(
        async (resp) => {
          await this.apiSvc.enviarNotificacionAOfertantes(
            this.translateSvc.instant('tabs.tab1.messageSearchDone'),
            `${this.translateSvc.instant('common.labelTitle')}:  ${
              this.searchText
            } \n${this.translateSvc.instant('common.labelDescription')}: ${
              iForm.descript
            }`,
            this.id_sector,
            this.id_subsector,
            resp.id
          );

          this.loadingSvc.dismiss();
          this.dismiss();
          this.toastSvc.show('tabs.tab1.messageSearchSent', true);
        },
        (err) => {
          this.loadingSvc.dismiss();
          this.toastSvc.show('tabs.tab1.errorPublishSearch');
        }
      );
    }
  }

  async cancel() {
    if (
      await this.alertSvc.confirm({
        title: 'tabs.tab1.pop.title',
        msg: 'tabs.tab1.pop.msg',
      } as IAlert)
    )
      this.dismiss();
  }
}
