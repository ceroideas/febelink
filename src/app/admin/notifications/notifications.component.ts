import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../base.component';

import { KeywordService } from '../keyword/services/keyword.service';

import { SearchforyouService } from '../../services/searchforyou.service';

import { Subsector } from '../../interfaces/subsector';
import { Sector } from '../../interfaces/sector';
import { Location } from '../../interfaces/location';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {

    @ViewChild('keywordsModal') keywordsModal: any;
    @ViewChild('subsectorsModal') subsectorsModal: any;
    @ViewChild('editModal') editModal: any;

    provinces: Location[] = [];
    subsectors: Subsector[] = [];
    sectors: Sector[] = [];
    notifications:any;

    loading: boolean = false;
    someSelected: boolean = false;
    loadingRequest: boolean = false;
    isNewRegister: boolean = true;

    notificationForm = new FormGroup({
        type: new FormControl(1, Validators.required),
        sector_type: new FormControl(1, Validators.required),
        profession_type: new FormControl(1, Validators.required),
        province_type: new FormControl(1, Validators.required),
        message_title: new FormControl('', Validators.required),
        message_content: new FormControl('', Validators.required),
        message_click_action: new FormControl(1, Validators.required)
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private keywordService: KeywordService,
        private cdRef: ChangeDetectorRef,
        private searchForYouService: SearchforyouService
    ) {
        // super();
    }

    ngOnInit() {
        this.getData();

        this.notificationForm.get('sector_type')?.valueChanges.subscribe(valor => {   
            this.searchForYouService.getProfessions(valor).then((data: any) => {
                this.subsectors = data.response.data;
                this.cdRef.detectChanges();
            })
            .catch((error) => {
                this.cdRef.detectChanges();
            });
        });
    }

    getData(refresh: boolean = false) {
        !refresh && (this.loading = true);

        this.searchForYouService.getNotifications([], []).then((data: any) => {
            this.notifications = data.response.data;

            this.loading = false;
            this.cdRef.detectChanges();
        })
        .catch((error) => {
            this.loading = false;
            this.cdRef.detectChanges();
        });

        this.keywordService.getSectorKeywords().then((data: any) => {
            this.sectors = data.response;

            this.loading = false;
            this.cdRef.detectChanges();
        })
        .catch((error) => {
            this.loading = false;
            this.cdRef.detectChanges();
        });

        this.keywordService.getLocationKeywords().then((data: any) => {
            this.provinces = data.response;

            this.loading = false;
            this.cdRef.detectChanges();
        })
        .catch((error) => {
            this.loading = false;
            this.cdRef.detectChanges();
        });
    }

    getSubsectors() {
        return this.keywordService.getSubSectorAll()
        .then((data: any) => {
            return data;
        })
        .catch((error) => {
            this.loading = false;
        });
    }

    showCreate(){
        this.editModal.nativeElement.showModal();
    }

    sendNotification(){
        this.loadingRequest = true;

        let form = this.notificationForm.value;
        try {
            this.searchForYouService.createNotification(form);

            this.getData(true);
            this.loadingRequest = false;
            this.editModal.nativeElement.close();
        } catch (error) {
            this.loadingRequest = false;
        }
    }
    
}