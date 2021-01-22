import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from './utilities.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public userLogged: EventEmitter<any> = new EventEmitter();
    public refreshTab: EventEmitter<any> = new EventEmitter();

    constructor(
        public alertController: AlertController,
        private http: HttpClient,
        private utilities: UtilitiesService,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    login(params, endpoint): Observable<any> {
        return this.http
            .post<any>(environment.API_URL_AUTH + endpoint, params)
            .pipe(
                map(async (res: any) => {
                    console.log('LOGIN RES', res);

                    if (res.user['suspended'] == 1) {
                        const alert = await this.alertController.create({
                            cssClass: 'my-custom-class',
                            header: 'Cuenta Deshabilitada',
                            message: 'Tu cuenta esta deshabilitada, contacta con soporte.',
                            buttons: ['Aceptar']
                        });

                        await alert.present();
                        this.router.navigate(['menu/todas']);
                        return false;

                    } else {
                        await this.utilities.saveAccessTokenInfo(res);
                        await this.utilities.saveUserData(res.user);
                        await this.utilities.saveUserSubscription(res.subscription);
                        await this.utilities.saveUserSubscriptionDetails(
                            res.subscription_details
                        );
                        await this.utilities.setGuia('login');
                        this.authenticationService.login();
                        this.userLogged.emit('user:login');
                        this.router.navigate(['menu/todas']);

                        return res;
                    }
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError(err, caught, 'login');
                })
            );
    }

    emitUserLogged() {
        this.userLogged.emit('user:login');
    }

    getUserLogged() {
        return this.userLogged;
    }

    refreshTabs() {
        this.refreshTab.emit('refreshTab');
    }

    async _getData(endpoint: string) {
        let token;
        await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
            if (tokenInfo !== null) token = tokenInfo.access_token;
        });

        return this.http
            .get<any>(environment.API_URL_AUTH + endpoint, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError(err, caught, endpoint);
                })
            );
    }

    async _createData(endpoint: string, data: any) {
        let token;
        await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
            token = tokenInfo.access_token;
        });

        //perform the API call
        return this.http
            .post<any>(environment.API_URL_AUTH + endpoint, data, {
                headers: {Authorization: `Bearer ${token}`},
            })
            .pipe(
                map((res: any) => {
                    return res;
                }),
                catchError((err: any, caught: Observable<any>) => {
                    return this.handleError(err, caught, endpoint);
                })
            );
    }

    /**
     * Recuperar contraseña y enviar email
     * @param email
     */
    public recuperarContraseña(email) {
        const formData = new FormData();
        formData.append('email', email);
        return this.http
            .post(environment.API_URL_AUTH + 'recuperar-contrasena', formData, {
                headers: {Authorization: `Bearer ${this.getToken()}`},
            })
            .toPromise()
            .then((response) => response);
    }

    /**
     * Guardamos el token de registro de las notificaciones push
     * @param tokenRegistro
     */
    public guardarTokenDeRegistro(tokenRegistro) {
        const formData = new FormData();
        formData.append('registerToken', tokenRegistro);
        formData.append('platform', this.utilities.getPlatform());

        return this._createData('guardar-token', formData);
    }

    //
    // /**
    //  * SuspendedUser
    //  * @param user_id
    //  */
    // public suspendedUser(user_id) {
    //   console.log('ytsgdfgd')
    //   const formData = new FormData();
    //   formData.append('user_id', user_id);
    //   formData.append('platform', this.utilities.getPlatform());
    //
    //   console.log( this._createData('suspended-user', formData));
    // }

    /**
     * Saltar guia
     */
    public noShowAgain(params): any {
        return this._createData('saltar-guia', params);
    }

    /**
     * Añadir a favoritos una demanda.
     * @param params
     */
    favouriteDemand(params) {
        const formData = new FormData();
        formData.append('id', params.id);
        return this._createData('favorite', formData);
    }

    /**
     * Eliminar de favoritos una demanda.
     * @param params
     */
    unFavouriteDemand(params) {
        const formData = new FormData();
        formData.append('id', params.id);
        return this._createData('unfavorite', formData);
    }

    /**
     * Obtener todos los favoritos del usuario.
     */
    getFavorites() {
        return this._getData('favorites');
    }

    /**
     * Borrar demanda a partir de su id
     * @param id
     */
    public borrarDemanda(id) {
        const formData = new FormData();
        formData.append('id', id);

        return this._createData('borrar-demanda', formData);
    }

    /**
     * Editar una demanda
     * @param params
     */
    public editarDemanda(params) {
        const formData = new FormData();
        formData.append('id', params.id);
        formData.append('nombre', params.nombre);
        formData.append('ofertas_restantes', params.ofertas_restantes);
        formData.append('descripcion', params.descripcion);
        if (params.sector != null && params.sector != '')
            formData.append('sector', params.sector);
        if (params.file != null) formData.append('file', params.file);

        return this._createData('editar-demanda', formData);
    }

    /**
     * Publicar una demanda
     * @param nombre
     * @param descripcion
     * @param sector
     * @param sub_sector
     * @param ofertas_restantes
     * @param file
     */
    public publicarDemanda(
        nombre,
        descripcion,
        sector,
        sub_sector,
        ofertas_restantes,
        file
    ) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);

        if (sector !== null) {
            formData.append('id_sector', sector);
            formData.append('sub_sector', sub_sector);
        }

        formData.append('ofertas_restantes', ofertas_restantes);
        formData.append('file', file);

        return this._createData('publicar-demanda', formData);
    }

    /**
     * Enviar notificación a todos los ofertantes
     * @param title
     * @param desc
     * @param sector
     * @param subsector
     */
    public enviarNotificacionAOfertantes(title, desc, sector, subsector) {
        const formData = new FormData();
        formData.append('mtitle', title);
        formData.append('mdesc', desc);

        if (sector !== null) {
            formData.append('sector', sector);
            formData.append('subsector', subsector);
        }

        return this._createData('notificacion-demanda', formData);
    }

    /**
     * Demandante responde a oferta
     * @param respuesta
     * @param id_oferta
     */
    public responderOferta(respuesta, id_oferta) {
        const formData = new FormData();
        formData.append('respuesta', respuesta);
        formData.append('id_oferta', id_oferta);
        return this._createData('responder-oferta', formData);
    }

    public subscribe(subscription_id, token) {
        const formData = new FormData();
        formData.append('subscription_id', subscription_id);
        formData.append('token', token);
        return this._createData('subscribe', formData);
    }

    /**
     * Enviar una notificación cuando se responde a la oferta
     * @param title
     * @param desc
     * @param id_oferta
     * @param respuesta
     */
    public enviarNotificationOfertaRespondida(title, desc, id_oferta, respuesta) {
        const formData = new FormData();
        formData.append('mtitle', title);
        formData.append('mdesc', desc);
        formData.append('id_ofertante', id_oferta);
        formData.append('respuesta', respuesta);
        return this._createData('notificacion-oferta', formData);
    }

    public swapSubscription(stripe_plan) {
        const formData = new FormData();
        formData.append('stripe_plan', stripe_plan);
        return this._createData('swap-subscription', formData);
    }

    public cancelSubscription() {
        const formData = new FormData();
        return this._createData('cancel-subscription', formData);
    }

    /**
     * Obtener todas las demandas
     */
    obtenerDemandas() {
        return this._getData('demandas');
    }

    /**
     * Obtener todos los sectores
     */
    public obtenerSectores() {
        return this._getData('sectores');
    }

    /**
     * Obtener los subsectores a partir de un sector id
     * @param id
     */
    public obtenerSubSectores(id) {
        return this._getData('sub-sectores/' + id);
    }

    /**
     * Obtener provincias
     */
    public obtenerProvincias() {
        return this._getData('provincias');
    }

    /**
     * Obtener los sectores de un perfil a partir de id
     * @param id
     */
    public obtenerSectoresPerfil(id) {
        return this._getData('sectores-perfil/' + id);
    }

    public suspendedUser(user_id) {
        const formData = new FormData();
        formData.append('user_id', user_id);
        return this._createData('suspended-user', formData);
    }

    public obtenerSubSectoresPerfil(id) {
        return this._getData('sub-sectores-perfil/' + id);
    }

    /**
     * Comprobar si existe un usuario a partir de su nombre (único)
     * @param name
     */
    public existeUsuario(name) {
        return this._getData('existe-usuario/' + name);
    }

    public getAllSubscriptions() {
        return this._getData('get-subscriptions');
    }

    /**
     * Search by keys
     */
    public searchByKeys(key) {
        return this._getData('buscar-keys?keys=' + key);
    }

    /**
     * Get sectors by keys
     */
    public getSectorsByKeys(key) {
        return this._getData('sectores-keys?keys=' + key);
    }

    /**
     * Get Bidders by score
     */
    public getBiddersByScore(id) {
        return this._getData('ofertantes-sector/' + id);
    }

    /**
     * Obtener las demandas del demandate a partir de su id
     * @param id
     */
    public getOpinionTypes() {
        return this._getData('get-opinions-types');
    }

    public getSubSectores(id) {
        return this._getData('get-sub-sectores-perfil/' + id);
    }

    /**
     * Obtener localidades
     */
    public obtenerLocalidades(id_provincia) {
        const formData = new FormData();
        formData.append('id_provincia', id_provincia);

        return this._createData('localidades', formData);
    }

    /**
     * Enviar notificación al recomendar perfil
     * @param title
     * @param desc
     * @param name
     */
    public enviarNotificacionPedirRecomendacion(title, desc, name) {
        const formData = new FormData();
        formData.append('mtitle', title);
        formData.append('mdesc', desc);
        formData.append('name', name);
        return this._createData('pedir-recomendacion', formData);
    }

    /**
     * Editar los datos del ofertante y su contraseña
     * @param name
     * @param email
     * @param descripcion
     * @param telefono
     * @param direccion
     * @param sector
     * @param dni
     * @param imagen
     * @param pass
     */
    public editarOfertanteYContra(
        name,
        email,
        descripcion,
        telefono,
        direccion,
        provincia,
        localidad,
        sector,
        sub_sector,
        dni,
        imagen,
        pass
    ) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('descripcion', descripcion);
        formData.append('telefono', telefono);
        formData.append('direccion', direccion);
        if (provincia !== undefined && provincia !== null)
            formData.append('province_id', provincia.id);
        if (localidad !== undefined && localidad !== null)
            formData.append('town_id', localidad.id);
        formData.append('sector', sector);
        formData.append('sub_sector', sub_sector);
        formData.append('dni', dni);
        if (imagen !== undefined) formData.append('file', imagen);
        formData.append('email', email);
        formData.append('password', pass);
        return this._createData('editar-ofertante', formData);
    }

    /**
     * Editar los datos del ofertante
     * @param name
     * @param email
     * @param descripcion
     * @param telefono
     * @param direccion
     * @param sector
     * @param sub_sector
     * @param dni
     * @param imagen
     */
    public editarOfertante(
        name,
        email,
        descripcion,
        telefono,
        direccion,
        provincia,
        localidad,
        sector,
        sub_sector,
        dni,
        imagen
    ) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('descripcion', descripcion);
        formData.append('telefono', telefono);
        formData.append('direccion', direccion);
        if (provincia !== undefined && provincia !== null)
            formData.append('province_id', provincia.id);
        if (localidad !== undefined && localidad !== null)
            formData.append('town_id', localidad.id);
        formData.append('sector', sector);
        formData.append('sub_sector', sub_sector);
        formData.append('dni', dni);
        if (imagen !== undefined) formData.append('file', imagen);
        formData.append('email', email);
        return this._createData('editar-ofertante', formData);
    }

    /**
     * Publicar una opinión a un demandate
     * @param valoracion
     * @param texto
     * @param id_demandante
     */
    public publicarOpinion(type_id, subsector_id, to_user_id) {
        const formData = new FormData();
        formData.append('type_id', type_id);
        formData.append('subsector_id', subsector_id);
        formData.append('to_user_id', to_user_id);
        return this._createData('publicar-opinion', formData);
    }

    /**
     * REalizar una oferta a una demanda por su id
     * @param nombre
     * @param descripcion
     * @param precio
     * @param id_demanda
     */
    public realizarOferta(nombre, descripcion, id_demanda) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('id_demanda', id_demanda);
        return this._createData('realizar-oferta', formData);
    }

    /**
     * Obtener las demandas relacionadas a una demanda del usuario
     * @param id_usuario
     * @param id_oferta
     */
    public obtenerDemandasRelacionadas(id_usuario, id_oferta) {
        return this._getData(
            'demandas-relacionadas/' + id_usuario + '/' + id_oferta
        );
    }

    /**
     * Obtener un perfil a partir de id
     * @param id
     */
    public obtenerPerfil(id) {
        return this._getData('obtener-perfil/' + id);
    }

    /**
     * Obtener las opiniones de un perfil segun id
     * @param id
     */
    public opinionesPerfil(id) {
        return this._getData('opiniones-perfil/' + id);
    }

    /**
     * Comprobar si existen opiniones
     * @param id_demandante
     */
    public comprobarOpinion(id_demandante) {
        return this._getData('comprobar-opiniones/' + id_demandante);
    }

    /**
     * Demandas recibidas por el ofertante
     */
    public demandasRecibidas() {
        return this._getData('demandas-recibidas');
    }

    /**
     * Obtener las demandas del demandate a partir de su id
     * @param id
     */
    public obtenerDemandasDemandante(id) {
        return this._getData('demandas-demandante/' + id);
    }

    /**
     * Obtener tus ofertas
     */
    public misOfertas() {
        return this._getData('mis-ofertas');
    }

    /**
     * Borrar una oferta
     * @param id
     */
    public borrarOferta(id) {
        return this._getData('borrar-oferta/' + id);
    }

    /**
     * Ofertas recibidas del demandante
     */
    public ofertasRecibidas() {
        return this._getData('ofertas-recibidas');
    }

    /**
     * Obtener demanda a partir de id
     * @param id
     */
    public obtenerDemanda(id) {
        return this._getData('demanda/' + id);
    }

    /**
     * Registro del ofertante
     * @param name
     * @param email
     * @param password
     * @param password_confirmation
     */
    public registro(params): any {
        const formData = new FormData();
        formData.append('name', params.name);
        formData.append('sector', params.sector);
        formData.append('sub_sector', params.sub_sector);
        formData.append('email', params.email);
        formData.append('password', params.password);
        formData.append('password_confirmation', params.password_confirmation);
        formData.append('role_id', '5');

        return this.http.post(environment.API_URL_AUTH + 'signup', formData);
    }

    handleError(error: any, caught: Observable<any>, endpoint: string) {
        switch (error.status) {
            case 401: {
                this.router.navigate(['login']);
                this.utilities.showToast('Sesión expirada');
                return throwError(error);
            }
            default: {
                return throwError(error);
            }
        }
    }

    /**
     * Asignar el token de autentificación a la cabecera de las peticiones futuras
     */
    async getToken() {
        await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
            return tokenInfo.access_token;
        });
    }
  public getAllMessages(params) {
    const formData = new FormData();
    formData.append('room_id', params);
    return this._createData('getallmessages', formData);
  }

  public getChatOferta(id_demanda,id_ofertante) {
    const formData = new FormData();
    formData.append('id_demanda', id_demanda);
    formData.append('id_ofertante', id_ofertante);
    return this._createData('getchatoferta', formData);
  }

  public setMessage(user_id,person_id,message,room,timecreated) {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('person_id', person_id);
    formData.append('message', message);
    formData.append('room', room);
    formData.append('timecreated', timecreated);
    return this._createData('setmessage', formData);
  }

  public openChat(room) {
    const formData = new FormData();
    formData.append('room', room);
    return this._createData('openchat', formData);
  }

  public closeChat(room) {
    const formData = new FormData();
    formData.append('room', room);
    return this._createData('closechat', formData);
  }

}
