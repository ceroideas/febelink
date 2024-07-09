import { Injectable } from '@angular/core';
import { IUser } from '../models/user.model';

declare const Froged: any;

@Injectable({
  providedIn: 'root'
})
export class FrogedService {

    constructor(){}

    track( key: string ) {
        Froged('track', key ); 
    }

    set( user: IUser ) {
        Froged( 'set', {
            userId: user?.id,
            email: user?.email,
            username: user?.nick,
            name: user?.name,
            lastname: user?.lastName,
            // birthdate: user?.birthdate,
            street: user?.direccion,
            city: user?.town_id,
            // postalcode:,
            state: user?.state,
            country: user?.country,
            phone: user?.telefono,
            // web: user?.web,
            avatar: user?.logo || user?.avatar,
            description: user?.descripcion,
            // company?,
            // lat?,                         // Latitude (number) 
            // lon?,                         // Longitude (number) 
            // newsletter
        })
    }
}
