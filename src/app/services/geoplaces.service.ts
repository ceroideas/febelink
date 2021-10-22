import { Injectable, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { TranslateConfigService } from "./translate/translate-config.service";
import { GeoPlacesModel } from '../models/geoplaces.model';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user.model';
import { UserLanding } from '../landing/models/user-landing';
import { environment } from 'src/environments/environment';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GeoPlacesApi {

    /**
     * DOCUMENTATION
     * https://developers.google.com/maps/documentation/places/web-service/search-text
     */

    API_URL: string = "https://maps.googleapis.com/maps/api/js";
    API_URL_ID: string = "https://maps.googleapis.com/maps/api/js";
    inputs: any[];
    place: GeoPlacesModel = null;
    loader: Loader;
    fields: string[] = [
        "address_components",
        "adr_address",
        "formatted_address",
        "place_id",
        "plus_code",
        "types",
        "url",
        "name"
    ];
    onResponse: ( place: GeoPlacesModel ) => void;
    onGotPlace: ( place: GeoPlacesModel ) => void;
    onError?: ( error: any ) => void;
    
    constructor(
        private rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        private translateService: TranslateConfigService,
        private http: HttpClient
    ) { }

    public OnResponse( onResponse: ( place: GeoPlacesModel ) => void ) : GeoPlacesApi {
        this.onResponse = onResponse;
        return this;
    }
    public OnGotPlace( onGotPlace: ( error: any ) => void ) : GeoPlacesApi {
        this.onGotPlace = onGotPlace;
        return this;
    }
    public OnError( onError: ( error: any ) => void ) : GeoPlacesApi {
        this.onError = onError;
        return this;
    }
    
    public async initModal( ...inputs: any[] ) {
        // Dentro de los Modal, si no lo haces asi no encuentras el elemento
        // ( no declarado aun )
        setTimeout( () => { this.init( ...inputs ); }, 0);
    }
    public async init( ...inputs: any[] ) {
        this.inputs = [];

        await inputs.forEach( async input => {
            input = await this.checkInput( input );
            
            // Just add input if not null
            if( input !== null )
                this.inputs.push( input );
        });
        
        if( this.inputs.length === 0 )
            // Has no elements for GooglePlacesApi
            return;

        // To Search acording to the selected|default language
        const lang = this.translateService.getDefaultLanguage();

        this.loader = new Loader({
            apiKey: environment.G_PLACES_API_KEY,
            version: "weekly",
            libraries: ["places"],
            language: lang
        });
        this.loader.load()
            .then((google) => {
                this.initAutocomplete( google );
            })
            .catch(e => {
                // do something
            });
    }

    private async checkInput( input: any ) : Promise<HTMLInputElement> {
        // Control if it is not an input, try to extract it
        // Since the API just accepts this element
        if( input instanceof HTMLInputElement )
            return input;
        else if ( input instanceof HTMLElement )
            return input.getElementsByTagName('input')[0];
        else if ( input instanceof HTMLIonInputElement )
            return await (input as HTMLIonInputElement).getInputElement();
        
        // No input found, get out of here
        return null;
    }
  
    initAutocomplete( google ) {
        this.inputs.forEach( input => {
            const autocomplete = new google.maps.places.Autocomplete( input );
            autocomplete.setFields( this.fields );

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.formatted_address) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    this.place = null;
                    const err = {
                        status: 'error',
                        message: 'No details available for:' + input.value
                    };
                    if( this.onError )
                        this.onError( err );
                    else
                        alert( err.message );

                    return;
                } else {
                    this.setDefaults( place );

                    if( this.onResponse )
                        this.onResponse( this.place );
                }
            });

            // Control to remove GooglePlace selection if text changes
            input.addEventListener( 'input', ( e ) => {
                if( this.place !== null && this.place.address !== input.value )
                    this.place = null;
            });
        });
    }

    private setDefaults( place, modifyThis: boolean =  true ) : GeoPlacesModel {
        // Declaration based on place
        const geoplace : GeoPlacesModel = {
            span_address: place.adr_address,
            address: place.formatted_address,
            placeType: place.name,
            place_id: place.place_id,
            url: place.url,

            Country: { long: '', short: '' },
            State: { long: '', short: '' },
            Department: { long: '', short: '' },
            Locality: { long: '', short: '' },
            Barrio: { long: '', short: '' },
            StreetNumber: { long: '', short: '' },
            StreetName: { long: '', short: '' },
            CP: { long: '', short: '' },
            CP_SUFIX: { long: '', short: '' }
        };

        // Loop to assign the params of GeoPlaces
        for( let i = 0; i < place.address_components.length; i++ ) {
            const item = place.address_components[ i ];
            if( item.types.includes( 'country' ))
                geoplace.Country = {
                    long: item.long_name,
                    short: item.short_name
                }
            else if( item.types.includes( 'administrative_area_level_1' ))
                geoplace.State = {
                    long: item.long_name,
                    short: item.short_name
                }
            else if( item.types.includes( 'administrative_area_level_2' ))
                geoplace.Department = {
                    long: item.long_name,
                    short: item.short_name
                }
            else if( item.types.includes( 'locality' ))
                geoplace.Locality = {
                    long: item.long_name,
                    short: item.short_name
                };
            else if( item.types.includes( 'neighborhood' ))
                geoplace.Barrio = {
                    long: item.long_name,
                    short: item.short_name
                };
            else if( item.types.includes( 'street_number' ))
                geoplace.StreetNumber = {
                    long: item.long_name,
                    short: item.short_name
                };
            else if( item.types.includes( 'route' ))
                geoplace.StreetName = {
                    long: item.long_name,
                    short: item.short_name
                };
            else if( item.types.includes( 'postal_code' ))
                geoplace.CP = {
                    long: item.long_name,
                    short: item.short_name
                };
            else if( item.types.includes( 'postal_code_suffix' ))
                geoplace.CP_SUFIX = {
                    long: item.long_name,
                    short: item.short_name
                };
        }
        
        if( modifyThis )
            this.place = geoplace;

        return geoplace;
    }

    // Funcion creada para llenar place con su valores guardados
    public setUserPlace( user: IUser | UserLanding ) {
        const address: string = (user as IUser).direccion ? (user as IUser).direccion : (user as UserLanding).address;
        const country: string = user.country;
        const state: string = user.state;
        const department: string = user.department;
        const locality: string = user.locality;
        
        const place_id: string = user.place_id;

        this.place = {
            address: address,
            Country: { long: country, short: country },
            State: { long: state, short: state },
            Department: { long: department, short: department },
            Locality: { long: locality, short: locality },
            place_id: place_id,
        };
    }

    // Funcion para devolver a la variable el place seleccionado
    public fillUserPlace( user: IUser | UserLanding ) {
        const interfaceTypeOf = (user as IUser).direccion ? 'IUser' : 'UserLanding'; 
        switch( interfaceTypeOf ) {
            case 'IUser':
                (user as IUser).direccion = this.place.address;
                break;
            case 'UserLanding':
                (user as UserLanding).address = this.place.address;
                break;
        }
        
        user.country = this.place.Country.short;
        user.state = this.place.State.long;
        user.department = this.place.Department.long;
        user.locality = this.place.Locality.long;

        user.place_id = this.place.place_id;
    }
    public getPlaceSelected(): GeoPlacesModel {
        return this.place;
    }
    public getPlace( id: string, onGotPlace?: ( place: GeoPlacesModel ) => void, onError?: ( place: GeoPlacesModel ) => void ) {
        // console.log( "\n======== CONSIGUIENDO CON EL GET ========\n");

        const map = 'https://maps.googleapis.com/maps/api/place/details/json';
        const placeid = `?placeid=${id}`;
        const key = `&key=${ environment.G_PLACES_API_KEY }`;
        const fields = `&fields=${ this.fields.join( ',' ) }`;
        const lang = `&language=${ this.translateService.getDefaultLanguage() }`;
        let url = `${ map }${ placeid }${ key }${ fields }${ lang }`;

        // Para devolver en caso de haber tenido un error
        const err = {
            status: 'error',
            message: null,
            msg: null,
            url: url
        };

        this.http.get<any>( url ).subscribe(
            (res: any) => {
                if( res.info_messages )
                    err.msg = res.info_messages;

                switch( res.status ) {
                    case 'OK':
                        const place = this.setDefaults( res.result, false );
                        if( onGotPlace )
                            onGotPlace( place );
                        // hago que salga para que no llegue a retornar el error
                        return;
                    case 'ZERO_RESULTS':
                        err.message = 'getPlace( id? ) => No hay resultados para el id: ' + id;
                        break;
                    case 'NOT_FOUND':
                        err.message = 'getPlace( id? ) => No he encontrado el id: ' + id;
                        break;
                    case 'INVALID_REQUEST':
                        err.message = 'getPlace( id? ) => Parece que la peticion es Invalida id: ' + id;
                        break;
                    case 'OVER_QUERY_LIMIT':
                        err.message = 'getPlace( id? ) => Cuota de Queries excedida';
                        break;
                    case 'REQUEST_DENIED':
                        err.message = 'getPlace( id? ) => Hay un error en la Key';
                        break;
                    case 'UNKNOWN_ERROR':
                    default:
                        err.message = 'getPlace( id? ) => No sé que ha pasado';
                        break;
                }

                // Si ha llegado aqui, viene con algun error
                err.status = res.status;
                if( onError )
                    onError( err );
            }, 
            ( err: any ) => {
                // Si ha llegado aqui, viene con algun error
                err.status = 'UNKNOWN_ERROR';
                err.message = 'getPlace( id? ) => No sé que ha pasado';
                err.error = err;
                if( onError )
                    onError( err );
            }
        );
    }
    public hasSelected(): boolean {
        // Controla que no sea null y a su vez que tenga asignado country
        return this.getPlaceSelected() && this.getPlaceSelected().Country.short ? true : false;
    }
}