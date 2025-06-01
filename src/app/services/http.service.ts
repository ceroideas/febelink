import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {UtilitiesService} from './utilities.service';
import {Router} from '@angular/router';
import {TranslateConfigService} from './translate/translate-config.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

export interface IHttpService {
  response?: any | null | undefined;
  error?: any | null | undefined;
}

interface MyObject {
  [key: string]: any;
}
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  token: string = "";
  sessionStorage = document.defaultView?.sessionStorage;
  constructor(
    private http: HttpClient,
    public utilities: UtilitiesService,
    private router: Router,
    private translateSvc: TranslateConfigService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.sessionStorage = document.defaultView?.sessionStorage;
    } else {
      // Implementación alternativa para el servidor
      this.sessionStorage  = undefined;
    }
  }

  private async getToken() {
    if (this.token) {
      return this.token;
    }

    await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
      if (tokenInfo) {
        this.token = tokenInfo.access_token;
      }
    });

    return this.token;
  }


  async get(endpoint: string, params?: any, transferCache: boolean = true): Promise<IHttpService> {
    let token

    if (this.sessionStorage?.getItem('accessTokenInfo') !== undefined && this.sessionStorage?.getItem('accessTokenInfo') !== null)
    //@ts-ignore
    token  =JSON.parse( this.sessionStorage?.getItem('accessTokenInfo'))
    let httpOptions: any;
    if ( token === undefined || token === null){
      httpOptions = {
        withCredentials: true,
        params: params,
        transferCache: transferCache
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token.access_token}`,
        }),
        withCredentials: true,
        params: params,
        transferCache: transferCache
      };
  
    }

    return new Promise<IHttpService>((resolve, reject) => {
      this.http.get(environment.API_URL_AUTH + endpoint, httpOptions).subscribe(
        (data) => {
          resolve({response: data});
        },
        (error) => {
          reject({error: error});
        }
      );
    })
  }

  async post(endpoint: string,data: {} | FormData = new FormData(), transferCache: boolean = true): Promise<IHttpService> {
    let token
    if (this.sessionStorage?.getItem('accessTokenInfo') !== undefined && this.sessionStorage?.getItem('accessTokenInfo') !== null)
    //@ts-ignore
    token  =JSON.parse( this.sessionStorage?.getItem('accessTokenInfo'))
    let httpOptions: any;
    if ( token === undefined || token === null){
      httpOptions = {
        withCredentials: true,
        transferCache: transferCache
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token.access_token}`,
        }),
        withCredentials: true,
        transferCache: transferCache
      };
  
    }

    console.log("test ceroideas",httpOptions);
  
    return new Promise<IHttpService>((resolve, reject) => {
      this.http.post(environment.API_URL_AUTH + endpoint, this.objToFromData(data), httpOptions).subscribe(
        (data) => {
          resolve({response: data});
        },
        (error) => {
          reject({error: error});
        }
      );
    })
  }


  async put(
    endpoint: string,
    data: {} | FormData = new FormData()
  ): Promise<IHttpService> {
    return this.toPromise(
      this.http.put<any>(
        environment.API_URL_AUTH + endpoint,
        this.objToFromData(data),
        {headers: await this.headers(), params: this.formDataToObj(data)}
      ),
      endpoint
    );
  }

  async patch(
    endpoint: string,
    data: {} | FormData = new FormData()
  ): Promise<IHttpService> {
    return this.toPromise(
      this.http.patch<any>(
        environment.API_URL_AUTH + endpoint,
        this.objToFromData(data),
        {headers: await this.headers(), params: this.formDataToObj(data)}
      ),
      endpoint
    );
  }

  async delete(
    endpoint: string,
    params: any = new FormData()
  ): Promise<IHttpService> {
    return this.toPromise(
      this.http.delete<any>(environment.API_URL_AUTH + endpoint, {
        headers: await this.headers(),
        params: params,
      }),
      endpoint
    );
  }

  async toPromise(
    request: Observable<any>,
    endpoint: string
  ): Promise<IHttpService> {
    return (await this.pipe(request, endpoint)).toPromise();
  }

  private async pipe(request: Observable<any>, endpoint: string) {
    return request.pipe(
      map((res: any) => {
        return {response: res};
      }),
      catchError((err: any, caught: Observable<any>) => {
        return this.handleError(err, caught, endpoint);
      })
    );
  }
  private async headersNew() {
    return {
      Authorization: `Bearer ${await this.getToken()}`,
      Lang: await this.translateSvc.getLanguage(),
    };
  }
  private async headers() {
    return {
      Authorization: `Bearer ${await this.getToken()}`,
    };
  }

  private objToFromData(obj: {} | FormData): FormData {
    if (obj instanceof FormData) {
      return obj;
    }

    const formData = new FormData();
    for (let key in obj) {
      //@ts-ignore
      //TODO: NOE
      let value = obj[key];
      if (!(typeof value === 'string') && !this.excepTypeOf(value)) {
        value = JSON.stringify(value);
      }

      formData.append(key, value);
    }

    return formData;
  }

  private formDataToObj(formData: {} | FormData): {} {
    if (formData instanceof Object) {
      return formData;
    }

    const obj = {};
    (formData as FormData).forEach((value, key) => {
       //@ts-ignore
      //TODO: NOE
      obj[key] = value;
    });

    return obj;
  }

  private handleError(error: any, caught: Observable<any>, endpoint: string) {
    switch (error.status) {
      case 401: {
        this.router.navigate(['registro']);
        this.utilities.showToast('Sesión expirada');
        return throwError(error);
      }
      default: {
        return of({error: error});
      }
    }
  }

  private excepTypeOf(value: any): boolean {
    return value instanceof File || value instanceof Blob;
  }
}
