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
    selector: 'app-automations',
    templateUrl: './automations.component.html',
})
export class AutomationsComponent implements OnInit {
    @ViewChild('keywordsModal') keywordsModal: any;
    @ViewChild('subsectorsModal') subsectorsModal: any;
    @ViewChild('editModal') editModal: any;
    @ViewChild('deleteModal') deleteModal: any;

    provinces: Location[] = [];
    subsectors: Subsector[] = [];
    sectors: Sector[] = [];
    automations:any;
    activeAuto:any;

    loading: boolean = false;
    someSelected: boolean = false;
    loadingRequest: boolean = false;
    isNewRegister: boolean = true;

    automationForm = new FormGroup({
        type: new FormControl(1, Validators.required),
        sector_type: new FormControl(1, Validators.required),
        profession_type: new FormControl(1, Validators.required),
        province_type: new FormControl(1, Validators.required),
        message_title: new FormControl('', Validators.required),
        message_content: new FormControl('', Validators.required),
        message_click_action: new FormControl(1, Validators.required),
        auto_id: new FormControl(null)
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

        this.automationForm.get('sector_type')?.valueChanges.subscribe(valor => {   
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

        this.searchForYouService.getAutomations([], []).then((data: any) => {
            this.automations = data.response.data;

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

    showEdit(item:any){
        this.isNewRegister = false;
        this.automationForm.patchValue({
            type:item.type,
            sector_type: item.sector_type,
            profession_type: item.profession_type,
            province_type: item.province_type,
            message_title: item.message_title,
            message_content: item.message_content,
            auto_id:item.id,
            message_click_action:item.message_click_action
        });
        this.editModal.nativeElement.showModal();
    }

    showDelete(id:any){
        this.activeAuto = id;
        this.deleteModal.nativeElement.showModal();
    }

    sendAutomation(){
        this.loadingRequest = true;

        let form = this.automationForm.value;
        try {
            this.searchForYouService.createAutomation(form).subscribe({
                next: (response) => {
                    if(response.success){
                        console.log('estoy en lo nuevo')
                        this.getData(true);
                        this.automationForm.reset();
                        this.editModal.nativeElement.close();
                        this.loadingRequest = false;
                    }
                },
                error: (err) => {
                  console.error('Error al crear la automatización', err);
                  this.loadingRequest = false;
                }
            });
        } catch (error) {
            this.loadingRequest = false;
        }
    }

    deleteAutomation(){
        this.loadingRequest = true;

        let data = {
            auto_id:this.activeAuto
        }

        try {
            this.searchForYouService.deleteAutomation(data);

            this.searchForYouService.createAutomation(form).subscribe({
                next: (response) => {
                    if(response.success){ 
                        console.log('estoy en lo nuevo3')
                        this.getData(true);
                        this.loadingRequest = false;
                        this.automationForm.reset();
                        this.deleteModal.nativeElement.close();
                    }
                },
                error: (err) => {
                    console.error('Error al crear la automatización', err);
                    this.loadingRequest = false;
                }
            });
        } catch (error) {
            this.loadingRequest = false;
        }
    }
}