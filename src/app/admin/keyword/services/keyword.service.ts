import {Injectable} from '@angular/core';
import {HttpService} from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {

  constructor(
    private http: HttpService
  ) {
  }

  public getSectorKeywords(activePage: number, filter?: string) {
    const formData = new FormData();
    formData.append('activePage', activePage + '');
    if (filter) {
      formData.append('filter', filter);
    }
    return this.http.post('admin/keyword/getSectorKeywords', formData);
  }

  public removeSectorKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/keyword/sector/${id}`);
    }
  }

  public addSectorKeyword(value: { sectorId: number, keyword: string }) {
    return this.http.post('admin/keyword/addSectorKeyword', value);
  }

  public updateSectorKeyword(value: { id: number, sectorId: number, keyword: string }) {
    return this.http.post('admin/keyword/updateSectorKeyword', value);
  }

  // SubSector

  public getSubSectorKeywords(activePage: number, filter?: string) {
    const formData = new FormData();
    formData.append('activePage', activePage + '');
    if (filter) {
      formData.append('filter', filter);
    }
    return this.http.post('admin/keyword/getSubSectorKeywords', formData);
  }

  public addSubSectorKeyword(value: { subSectorId: number, keyword: string }) {
    return this.http.post('admin/keyword/addSubSectorKeyword', value);
  }

  public updateSubSectorKeyword(value: { id: number, subSectorId: number, keyword: string }) {
    return this.http.post('admin/keyword/updateSubSectorKeyword', value);
  }

  public removeSubSectorKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/keyword/sub-sector/${id}`);
    }
  }
}
