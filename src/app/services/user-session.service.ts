import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastSvc } from './toast.service';
import { IUser } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserSessionSvc
{
    user: IUser;
    static KEY: string = 'userData'

    constructor(
        private storage: Storage
        , private toastSvc: ToastSvc
    ) {}

    save( user: IUser ): Promise<boolean>
    {
        return new Promise(( resolve, reject ) => {
            this.storage.set( UserSessionSvc.KEY, user )
            .then(() => resolve( true ))
            .catch(error => reject( false ))
        })
    }

    get(): Promise<IUser>
    {
        return new Promise((resolve, reject) =>
        {
            if( this.user ) {
                resolve( this.user )
                return
            }

            this.storage.ready()
                .then(() =>
                {
                    this.storage.get( UserSessionSvc.KEY ).then(userData =>
                    {
                        this.user = userData
                        resolve(userData)
                    })
                    .catch(error => { console.log({ error }); reject( null )})
                })
                .catch( error => { console.log({ error }); reject( null )})
        })
    }

    async id()
    {
        return ( await this.get() )?.id
    }

    async isUser( id: number )
    {
        return ( await this.get() )?.id == id
    }

    async isLogged()
    {
        return await this.get() != null;
    }

    async checkLogged() {
        if( !await this.get() ) {
            this.toastSvc.show( 'common.not-logged', true )
            return false
        }
      return true
    }

    async isAdmin() {
        return ( await this.get() )?.role_id == 3;
    }
}