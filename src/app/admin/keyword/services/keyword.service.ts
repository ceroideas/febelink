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


  // Read Data
  public getData() {
    return this.http.get('getData');
  }

  // Sector
  public getSectorKeywords() {
    return this.http.get('getSector');
  }

  public removeSectorKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteSector/${id}`);
    }
  }

  public addSectorKeyword(value: { name: string, searchTerm: string, icon: string}) {
    return this.http.post('admin/createSector', value);
  }

  public updateSectorKeyword(value: { sector: number, name: string, searchTerm: string, icon: string }) {
    return this.http.post('admin/updateSector', value);
  }

  public getSubSectorAll() {
    return this.http.get('getSubsectorAll');
   
  }

  // SubSector
  public getSubSectorKeywords(activePage: number, filter?: string) {
    return this.http.get('getSubsector/1');
  }

  public addSubSectorKeyword(value: { sector: number,name: string, link: string , imageURL: string, h1: string,  pagetitle: string, metadescription: string}) {
    return this.http.post('admin/createSubsector', value);
  }

  public updateSubSectorKeyword(value: { sector: number, subsector: number, name: string, link: string , imageURL: string , h1: string,  pagetitle: string, metadescription: string}) {
    return this.http.post('admin/updateSubsector', value);
  }

  public removeSubSectorKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteSubsector/${id}`);
    }
  }


  // Ubicationes
  public getLocationKeywords() {
    return this.http.get('getLocation');
  }

  public addLocationKeyword(value: {  title: string, link: string , h1: string,  pagetitle: string, metadescription: string}) {
    return this.http.post('admin/createLocations', value);
  }

  public updateLocationKeyword(value: {locations: number, title: string, link: string, h1: string,  pagetitle: string, metadescription: string }) {
    return this.http.post('admin/updateLocations', value);
  }

  public removeLocationKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteLocations/${id}`);
    }
  }




  // Enlaces de ubicaciones
  public getLinkLocationKeywords() {
    return this.http.get('getLinkLocationsAll');
  }

  public addLinkLocationKeyword(value: { sector: number, locations: number, title: string, link: string, pagetitle: string, h1: string, h2: string, description: string}) {
    return this.http.post('admin/createLinkLocations', value);
  }

  public updateLinkLocationKeyword(value: {linkLocations: number, sector: number, locations: number, title: string, link: string, pagetitle: string, h1: string, h2: string, description: string}) {
    return this.http.post('admin/updateLinkLocations', value);
  }

  public removeLinkLocationKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteLinkLocations/${id}`);
    }
  }


   // Enlaces de ciudades
   public getCityKeywords() {
    return this.http.get('getCity');
  }

  public addCityKeyword(value: { location: number, title: string, link: string , h1: string,  pagetitle: string, metadescription: string}) {
    return this.http.post('admin/createCitys', value);
  }

  public updateCityKeyword(value: { location: number, city: string, link: string , h1: string,  pagetitle: string, metadescription: string}) {
    return this.http.post('admin/updateCitys', value);
  }

  public removeCityKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteCitys/${id}`);
    }
  }



  // Enlaces de Ciudades
  public getLinkCityKeywords() {
    return this.http.get('getLinkCitysAll');
  }
  public getCityLocation(id: number) {
    if (id) {
      return this.http.get(`getCityLocation/${id}`);
    }
  }
  public getLinkCitysLocation(id: number) {
    if (id) {
      return this.http.get(`getLinkCitysLocation/${id}`);
    }
  }

  public getLinkCitysLocationSector(id: number, sector: number) {
    if (id && sector) {
      return this.http.get(`getLinkCitysLocationSector/${id}/${sector}`);
    }
  
  }
  public addLinkCityKeyword(value: { sector: number, location: number, city: number, title: string, link: string, pagetitle: string, h1: string, h2: string, description: string}) {
    return this.http.post('admin/createLinkCitys', value);
  }

  public updateLinkCityKeyword(value: {linkcity: number, sector: number,  city: number,location: number, title: string, link: string, pagetitle: string, h1: string, h2: string, description: string}) {
    return this.http.post('admin/updateLinkCitys', value);
  }

  public removeLinkCityKeyword(id: number) {
    if (id) {
      return this.http.delete(`admin/deleteLinkCitys/${id}`);
    }
  }
}
