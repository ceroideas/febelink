import { Injectable } from '@angular/core';
import { HttpService, IHttpService } from './http.service';
import { ISearchFull } from '../pages/lo-buscamos-por-ti/models/lo-buscamos-por-ti.model';

@Injectable({
    providedIn: 'root'
})
export class SearchforyouService {

    constructor(
        private http: HttpService
    ) {}

    async create(seacrh: ISearchFull): Promise < IHttpService > {
        return this.http.post('findService', seacrh);
    }

    async delete(id: number): Promise < IHttpService > {
        return this.http.delete(`deleteFindService/${id}`);
    }

    async update(seacrh: ISearchFull): Promise < IHttpService > {
        return this.http.post('updateFindService', seacrh);
    }

    async getAllRequests(subsectors: number[], provinces: number[]): Promise < IHttpService > {
        return this.http.post('getAllFindServices', {
            subsectors: JSON.stringify(subsectors),
            provinces: JSON.stringify(provinces),
        }, true);
    }

    //Ceroideas
    async getUserNotifications(subsectors: number[], provinces: number[]): Promise < IHttpService > {
        return this.http.post('getUserNotifications', {
            subsectors: JSON.stringify(subsectors),
            provinces: JSON.stringify(provinces),
        }, true);
    }

    async getAutomations(subsectors: number[], provinces: number[]): Promise < IHttpService > {
        return this.http.post('getAutomations', {
            subsectors: JSON.stringify(subsectors),
            provinces: JSON.stringify(provinces),
        }, true);
    }

    async getNotifications(subsectors: number[], provinces: number[]): Promise < IHttpService > {
        return this.http.post('getNotifications', {
            subsectors: JSON.stringify(subsectors),
            provinces: JSON.stringify(provinces),
        }, true);
    }

    async getPromps(subsectors: number[], provinces: number[]): Promise < IHttpService > {
        return this.http.post('getPromps', {
            subsectors: JSON.stringify(subsectors),
            provinces: JSON.stringify(provinces),
        }, true);
    }

    async getProfessions(sector:any): Promise < IHttpService > {
        return this.http.get('getSubsectorinfo/'+sector, {}, true);
    }

    async createAutomation(form:any): Promise < IHttpService > {
        return this.http.post('createAutomation', form, true);
    }

    async createNotification(form:any): Promise < IHttpService > {
        return this.http.post('createNotification', form, true);
    }

    async createPromp(form:any): Promise < IHttpService > {
        return this.http.post('createPromp', form, true);
    }

    async deletePromp(form:any): Promise < IHttpService > {
        return this.http.post('deletePromp', form, true);
    }

    async deleteAutomation(form:any): Promise < IHttpService > {
        return this.http.post('deleteAutomation', form, true);
    }

    async deleteNotification(form:any): Promise < IHttpService > {
        return this.http.post('deleteNotification', form, true);
    }

    async readUserNotification(form:any): Promise < IHttpService > {
        return this.http.post('readUserNotification', form, true);
    }
}