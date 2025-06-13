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
    selector: 'app-promps',
    templateUrl: './promps.component.html',
    styleUrls: ['./promps.component.scss'],
})
export class PrompsComponent implements OnInit {
    @ViewChild('keywordsModal') keywordsModal: any;
    @ViewChild('subsectorsModal') subsectorsModal: any;
    @ViewChild('editModal') editModal: any;
    @ViewChild('deleteModal') deleteModal: any;

    provinces: Location[] = [];
    subsectors: Subsector[] = [];
    sectors: Sector[] = [];
    promps:any;
    activePromp:any;

    loading: boolean = false;
    someSelected: boolean = false;
    loadingRequest: boolean = false;
    isNewRegister: boolean = true;


    prompsForm = new FormGroup({
        sector_type: new FormControl(1, Validators.required),
        profession_type: new FormControl(1, Validators.required),
        province_type: new FormControl(1, Validators.required),
        message_content: new FormControl('', Validators.required),
        pro_id: new FormControl(null)
    });

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private keywordService: KeywordService,
        private cdRef: ChangeDetectorRef,
        private searchForYouService: SearchforyouService
    ) {}

    ngOnInit() {
        this.getData();

        this.prompsForm.get('sector_type')?.valueChanges.subscribe(valor => {   
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

        this.searchForYouService.getPromps([], []).then((data: any) => {
            this.promps = data.response.data;

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

    showEdit(promp:any){
        this.isNewRegister = false;
        this.prompsForm.patchValue({
            sector_type: promp.sector_type,
            profession_type: promp.profession_type,
            province_type: promp.province_type,
            message_content: promp.promp,
            pro_id:promp.id
        });
        this.editModal.nativeElement.showModal();
    }

    showDelete(promp:any){
        this.activePromp = promp.id;
        this.deleteModal.nativeElement.showModal();
    }

    resetForm(){
        this.prompsForm.patchValue({
            sector_type:1,
            profession_type: 1,
            province_type: 1,
            message_content: '',
            pro_id:null,
        });
    }

    async sendPromp(){
        this.loadingRequest = true;

        let form = this.prompsForm.value;
        try {
            await this.searchForYouService.createPromp(form);
            this.getData(true);
            this.loadingRequest = false;
            this.editModal.nativeElement.close();
            this.resetForm();
            this.isNewRegister = true;
        } catch (error) {
            this.loadingRequest = false;
        }
    }

    async deleteProm(){
        this.loadingRequest = true;

        let data = {
            pro_id:this.activePromp
        };

        try {
            await this.searchForYouService.deletePromp(data);
            this.getData(true);
            this.loadingRequest = false;
            this.resetForm();
            this.deleteModal.nativeElement.close();
        } catch (error) {
            this.loadingRequest = false;
        }
    }
}