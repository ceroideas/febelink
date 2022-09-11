import { Injectable } from '@angular/core';
//import { HttpService, IHttpService } from 'src/app/services/http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CuentaProfesionalService {
  constructor(
      private http: HttpClient
  ) {}

  async getTypeGeo(id: number){
    return new Promise((resolve, reject) => {
      this.http.get('assets/disponibilidad_geografica.json')
        .subscribe(data => {
            resolve(data);
        }, error => {
          console.log('Error al obtener los datos recomendados: ' + error);
          reject(error);
        });
    })
  }

  async getProfesiones(id: number){
    return new Promise((resolve, reject) => {
      this.http.get('assets/cuenta_profesional.json')
        .subscribe(data => {
            resolve(data);
        }, error => {
          console.log('Error al obtener los datos recomendados: ' + error);
          reject(error);
        });
    })
  }
  
  
}
