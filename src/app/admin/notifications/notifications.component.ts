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
    @ViewChild('deleteModal') deleteModal: any;

    provinces: Location[] = [];
    subsectors: Subsector[] = [];
    sectors: Sector[] = [];
    notifications:any;
    activeNotification:any;

    loading: boolean = false;
    someSelected: boolean = false;
    loadingRequest: boolean = false;
    isNewRegister: boolean = true;

    notificationForm = new FormGroup({
        sector_type: new FormControl(1, Validators.required),
        profession_type: new FormControl(1, Validators.required),
        province_type: new FormControl(1, Validators.required),
        message_title: new FormControl('', Validators.required),
        message_content: new FormControl('', Validators.required),
        message_click_action: new FormControl(1, Validators.required),
        send_type: new FormControl(1, Validators.required),
        send_date: new FormControl(null),
        send_date_hour: new FormControl(null),
        not_id:new FormControl(null),
        custom_url:new FormControl(null)
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

    showDelete(id:any){
        this.activeNotification = id;
        this.deleteModal.nativeElement.showModal();
    }

    showEdit(item:any){
        this.isNewRegister = false;
        this.notificationForm.patchValue({
            sector_type: item.sector_type,
            profession_type: item.profession_type,
            province_type: item.province_type,
            message_title: item.message_title,
            message_content: item.message_content,
            not_id:item.id,
            message_click_action:item.message_click_action,
            send_type:item.send_type,
            send_date:item.send_date,
            send_date_hour:item.send_date_hour,
            custom_url:item.custom_url
        });
        this.editModal.nativeElement.showModal();
    }

    resetForm(){
        this.notificationForm.patchValue({
            sector_type:1,
            profession_type: 1,
            province_type: 1,
            message_title: '',
            message_content: '',
            not_id:null,
            message_click_action:1,
            send_type:1,
            send_date:null,
            send_date_hour:null,
            custom_url:null
        });
    }

    async sendNotification(){
        this.loadingRequest = true;

        let form = this.notificationForm.value;
        try {
            await this.searchForYouService.createNotification(form);

            this.getData(true);
            this.loadingRequest = false;
            this.resetForm();
            this.editModal.nativeElement.close();
        } catch (error) {
            this.loadingRequest = false;
        }
    }

    async deleteNotification(){
        this.loadingRequest = true;

        let data = {
            not_id:this.activeNotification
        }
        try {
            await this.searchForYouService.deleteNotification(data);

            this.getData(true);
            this.loadingRequest = false;
            this.resetForm();
            this.deleteModal.nativeElement.close();
        } catch (error) {
            this.loadingRequest = false;
        }
    }
}