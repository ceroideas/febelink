import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

import { KeywordService } from '../../admin/keyword/services/keyword.service';

import { UtilitiesService } from '../../services/utilities.service';
import { ModalService } from '../../services/modal.service';
import { SearchforyouService } from '../../services/searchforyou.service';

import { Subsector } from '../../interfaces/subsector';
import { Location } from '../../interfaces/location';

@Component({
  selector: 'app-ask-for-budget',
  templateUrl: './ask-for-budget.component.html',
  styleUrls: ['./ask-for-budget.component.scss'],
})
export class AskForBudgetComponent implements OnInit {

  @ViewChild('dataSentInfoModal') dataSentInfoModal: any;
  
  subsector: number = 0;
  subsectors: Subsector[] = [];

  location: number = 0;
  locations: Location[] = [];

  title: string = "";
  name: string = "";
  email: string = "";
  phone: string = "";

  subsectorError: boolean = false;
  locationError: boolean = false;
  titleError: boolean = false;
  nameError: boolean = false;
  emailError: boolean = false;
  phoneError: boolean = false;

  currentUser: any = {
    nick: null,
    email: null,
    telefono: null
  }

  loading: boolean = true;
  loadingRequest: boolean = false;

  formError: boolean = false;

  EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/g;
  MOBILE_PHONE_REGEX_ES = /^((6|7){1}[0-9]{8})$/g;

  constructor(
    private keywordService: KeywordService,
    private cdRef: ChangeDetectorRef,
    private utilities: UtilitiesService,
    private modalService: ModalService,
    private servicesSvc: SearchforyouService
  ) { }

  async ngOnInit() {
    this.currentUser = {...(await this.utilities.getUserData())};

    this.keywordService.getSubSectorAll()
    .then((data: any) => {
      this.subsectors = data.response;

      this.loading = false;
      this.cdRef.detectChanges();
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });

    this.keywordService.getLocationKeywords()
    .then(async (data: any) => {
      this.locations = data.response;
      this.locations.sort((a, b) => a.title.localeCompare(b.title));
    })
    .catch((error) => {
      this.loading = false;
      this.cdRef.detectChanges();
    });
  }

  close() {
    this.modalService.close();
  }

  formValid() {
    let allOk = true;

    if (this.subsector === 0) {
      allOk = false;
      this.subsectorError = true;
    } else {
      this.subsectorError = false;
    }

    if (this.location === 0) {
      allOk = false;
      this.locationError = true;
    } else {
      this.locationError = false;
    }

    if (this.title.trim() === "") {
      allOk = false;
      this.titleError = true;
    } else {
      this.titleError = false;
    }

    if ( !this.currentUser?.email ) {
      if ( this.name.trim() === "" ) {
        allOk = false;
        this.nameError = true;
      } else {
        this.nameError = false;
      }

      if ( this.email.trim() === "" || this.email.trim().match(this.EMAIL_REGEX) === null ) {
        allOk = false;
        this.emailError = true;
      } else {
        this.emailError = false;
      }

      if ( this.phone.trim() === "" || this.phone.trim().match(this.MOBILE_PHONE_REGEX_ES) === null ) {
        allOk = false;
        this.phoneError = true;
      } else {
        this.phoneError = false;
      }
    }

    this.formError = !allOk;

    return allOk
  }

  sendRequest() {
    if ( !this.formValid() ) {
      return;   // BREAK EXECUTION
    }

    this.loadingRequest = true;

    this.servicesSvc.create({
      name: !this.currentUser?.email ? this.name : undefined,
      email: !this.currentUser?.email ? this.email : undefined,
      phone: !this.currentUser?.email ? this.phone : undefined,
      location: this.location.toString(),
      subsector: this.subsector.toString(),
      description: this.title,
    }).then((response: any) => {

    }).catch((error) => {

    }).finally(() => {
      this.showDataSentModal();
      this.loadingRequest = false;
    });
  }

  showDataSentModal() {
    this.dataSentInfoModal.nativeElement.showModal();
  }
  closeDataSentModal() {
    this.dataSentInfoModal.nativeElement.close();
    this.close();
  }
}
