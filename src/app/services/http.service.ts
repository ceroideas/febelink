import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from './utilities.service';
import { Router } from '@angular/router';
import { TranslateConfigService } from './translate/translate-config.service';

@Injectable({
    providedIn: 'root',
})
export class HttpService {

    token: string;

    constructor(
        private http: HttpClient
        , public utilities: UtilitiesService
        , private router: Router
        , private translateSvc: TranslateConfigService
    ) {}

    private async getToken()
    {
        if( this.token )
            return this.token;

        await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
            if (tokenInfo !== null) this.token = tokenInfo.access_token;
        });

        return this.token;
    }

    async get(endpoint: string, params?: {} ): Promise<{ response, error }>
    {
        return this.toPromise( this.http
            .get<any>(environment.API_URL_AUTH + endpoint, {
                headers: await this.headers(),
                params: params
            }), endpoint )
    }

    async post(endpoint: string, data: {} | FormData = new FormData() )
    {
        return this.http
            .post<any>(environment.API_URL_AUTH + endpoint
                , this.objToFromData( data )
                , { headers: await this.headers() }
            )
            .pipe(
                map((res: any) => {
                    return { response: res };
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError( err, caught, endpoint )
                })
            );
    }

    async put(endpoint: string, data: {} | FormData = new FormData )
    {
        return this.http
            .put<any>(environment.API_URL_AUTH + endpoint
                , this.objToFromData( data )
                , { headers: await this.headers(), params: this.formDataToObj( data )}
            )
            .pipe(
                map((res: any) => {
                    return { response: res };
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError( err, caught, endpoint )
                })
            );
    }

    async patch(endpoint: string, data: {} | FormData = new FormData ): Promise<{ response, error }>
    {
        return this.toPromise( this.http
            .patch<any>(environment.API_URL_AUTH + endpoint
                , this.objToFromData( data )
                , { headers: await this.headers(), params: this.formDataToObj( data )}
            ), endpoint )
    }

    async delete(endpoint: string, params: any = new FormData() )
    {
        return this.http
            .delete<any>(environment.API_URL_AUTH + endpoint, {
                headers: await this.headers(),
                params: params
            })
            .pipe(
                map((res: any) => {
                    return { response: res };
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError( err, caught, endpoint );
                })
            );
    }

    private async toPromise( request: Observable<any>, endpoint: string ): Promise<{ response, error }> {
        return ( await this.pipe( request, endpoint )).toPromise();
    }

    private async pipe( request: Observable<any>, endpoint: string ) {
        return request.pipe(
            map((res: any) => {
                return { response: res };
            }),
            catchError((err: any, caught: Observable<any>) => {
                return this.handleError( err, caught, endpoint );
            })
        )
    }

    

    private async headers()
    {
        return {
            Authorization: `Bearer ${ await this.getToken()}`
            , Lang: await this.translateSvc.getLanguage()
        }
    }

    private objToFromData( obj: {} | FormData ): FormData
    {
        if( obj instanceof FormData )
            return obj;

        const formData = new FormData();
        for (let key in obj ) {
            let value = obj[ key ];
            if ( !( typeof value === "string" ))
                value = JSON.stringify( value );

            formData.append( key, value );
        }

        return formData;
    }

    private formDataToObj( formData: {} | FormData ): {}
    {
        if( formData instanceof Object )
            return formData;

        const obj = {};
        ( formData as FormData ).forEach(( value, key ) => {
            obj[ key ] = value;
        })

        return obj;
    }

    private handleError(error: any, caught: Observable<any>, endpoint: string)
    {
        switch (error.status) {
            case 401: {
                this.router.navigate(['login']);
                this.utilities.showToast('Sesión expirada');
                return throwError( error );
            }
            default: {
                return of({ error: error });
            }
        }
    }
}