import { Injectable, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, first, map } from 'rxjs/operators';
import { UtilitiesService } from './utilities.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication/authentication.service';
import { AlertController, Platform } from '@ionic/angular';
import { UnreadMessages } from '../models/unreadMessages';
import { TranslateConfigService } from './translate/translate-config.service';
import { ILang, ILangDEFAULTS } from '../models/langs.model';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public userLogged: EventEmitter<any> = new EventEmitter();
  public refreshTab: EventEmitter<any> = new EventEmitter();
  sessionStorage = document.defaultView?.sessionStorage;
  constructor(
    public alertController: AlertController,
    private http: HttpClient,
    public utilities: UtilitiesService,
    private router: Router,
    private authenticationService: AuthenticationService,
    public translateSvc: TranslateConfigService,
    private platform: Platform,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.sessionStorage = this.sessionStorage ;
    } else {
      // Implementación alternativa para el servidor
      this.sessionStorage  = undefined;
    }
  }

  verifiedChangePassword(token: any) {
    const formData = new FormData();
    formData.append('token', token);
    // return this._createData('update/register', formData);
    return this.http.post(environment.API_URL_AUTH + 'verifiedChangePassword', formData).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err: any, caught: Observable<any>) => {
        return this.handleError(err, caught, '');
      })
    );;
  }

  updatePasswornd(params: any) {
    const formData = new FormData();
    formData.append('token', params.token);
    formData.append('password', params.password);
    // return this._createData('update/register', formData);
    return this.http.post(environment.API_URL_AUTH + 'update/register', formData).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err: any, caught: Observable<any>) => {
        return this.handleError(err, caught, '');
      })
    );;
  }
  login(
    params: any,
    endpoint: any,
    firstLogin?: boolean,
    redirect?: string
  ): Observable<any> {
    return this.http
      .post<any>(environment.API_URL_AUTH + endpoint, params)
      .pipe(
        map(async (res: any) => {
          if (res.user['suspended'] == 1) {
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Cuenta Deshabilitada',
              message: 'Tu cuenta esta deshabilitada, contacta con soporte.',
              buttons: ['Aceptar'],
            });

            await alert.present();
            this.router.navigate([environment.HOME_PAGE]);
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
            switch (redirect) {
              case 'token':
                this.router.navigate(['token', 'buy']);
                break;

              default:
                if (firstLogin) {
                  this.router.navigate(['menu/welcome']);
                } else {
                  this.router.navigate([environment.HOME_PAGE]);
                }
                break;
            }

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

  async getUserData() {
    return (await this._getData('user')).pipe(first());
  }

  refreshTabs() {
    this.refreshTab.emit('refreshTab');
  }

  async _getData(endpoint: string) {
    let token;
    await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
      if (tokenInfo) {
        token = tokenInfo.access_token;
      }
    });

    const lang = await this.translateSvc.getLanguage();

    return this.http
      .get<any>(environment.API_URL_AUTH + endpoint, {
        headers: { Authorization: `Bearer ${token}`, Lang: lang },
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

  async _createData(endpoint: string, data: any = new FormData()) {

    let token
    if (this.sessionStorage?.getItem('accessTokenInfo') !== undefined && this.sessionStorage?.getItem('accessTokenInfo') !== null)
    //@ts-ignore
    token  =JSON.parse( this.sessionStorage?.getItem('accessTokenInfo'))
    let httpOptions 
    if ( token === undefined || token === null){
      httpOptions = {
        withCredentials: true,
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token.access_token}`,
        }),
        withCredentials: true,
      };
  
    }

    const lang = await this.translateSvc.getLanguage();
    //perform the API call
  
    return this.http
      .post<any>(environment.API_URL_AUTH + endpoint, data, httpOptions)
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
  public async recuperarContraseña(email:string, lang: string) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('lang', lang);
    const responseObs: Observable<any> = await this._createData(
      'recuperar-contrasena',
      formData
    );
    return responseObs.pipe(first()).toPromise();
  }

  /**
   * Guardamos el token de registro de las notificaciones push
   * @param tokenRegistro
   */
  public async guardarTokenDeRegistro(tokenRegistro: any) {
    const formData = new FormData();
    formData.append('registerToken', tokenRegistro);
    


    let plataform;
    if (
      this.platform.is('ios')
      || this.platform.is('android')) {
        plataform = this.utilities.getPlatform()
    } else {
      plataform = 'desktop'
    }
    
    formData.append('platform', plataform);
    
    const responseObs: Observable<any> = await this._createData(
      'guardar-token',
      formData
    );
    return responseObs.pipe(first()).toPromise();
  }

  //
  // /**
  //  * SuspendedUser
  //  * @param user_id
  //  */
  // public suspendedUser(user_id:number) {
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
  public noShowAgain(params: any): any {
    return this._createData('saltar-guia', params);
  }

  /**
   * Añadir a favoritos una demanda.
   * @param params
   */
  favouriteDemand(params: any) {
    const formData = new FormData();
    formData.append('id', params.id);
    return this._createData('favorite', formData);
  }

  /**
   * Eliminar de favoritos una demanda.
   * @param params
   */
  unFavouriteDemand(params: any) {
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
  public borrarDemanda(id: any) {
    const formData = new FormData();
    formData.append('id', id);

    return this._createData('borrar-demanda', formData);
  }

  /**
   * Editar una demanda
   * @param params
   */
  public editarDemanda(params: any) {
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
    nombre: any,
    descripcion: any,
    sector: any,
    sub_sector: any,
    ofertas_restantes: any,
    file: any,
    userInfo?: any,
    userId?: any,
  ) {
    const formData = new FormData();
    formData.append('descripcion', descripcion);

    if (sector !== null) {
      formData.append('id_sector', sector);
      formData.append('sub_sector', sub_sector);
    }

    formData.append('ofertas_restantes', ofertas_restantes);
    formData.append('file', file);

    if (userInfo) {
      formData.append('nombre', userInfo.nombre);
      formData.append('email', userInfo.email);
      formData.append('password', userInfo.password);
      formData.append('locality', userInfo.locality);
    } else {
      if (userId) formData.append('userId', userId);
      formData.append('nombre', nombre);
    }

    return this._createData('publicar-demanda', formData);
  }

  /**
   * Enviar notificación a todos los ofertantes
   * @param title
   * @param desc
   * @param sector
   * @param subsector
   */
  public enviarNotificacionAOfertantes(
    title: any,
    desc: any,
    sector: any,
    subsector: any,
    searchId?: any
  ) {
    const formData = new FormData();
    formData.append('mtitle', title);
    formData.append('mdesc', desc);
    formData.append('searchId', searchId);

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
  public responderOferta(respuesta:any, id_oferta:any) {
    const formData = new FormData();
    formData.append('respuesta', respuesta);
    formData.append('id_oferta', id_oferta);
    return this._createData('responder-oferta', formData);
  }

  public subscribe(subscription_id:any, token:any) {
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
  public enviarNotificationOfertaRespondida(title: string, desc: string, id_oferta: string, respuesta: any) {
    const formData = new FormData();
    formData.append('mtitle', title);
    formData.append('mdesc', desc);
    formData.append('id_ofertante', id_oferta);
    formData.append('respuesta', respuesta);
    return this._createData('notificacion-oferta', formData);
  }

  public async paySubscription(idSelectedSubscription: number) {
    const formData = new FormData();
    formData.append('subscriptionId', idSelectedSubscription + '');
    const responseObs: Observable<any> = await this._createData(
      'paySubscription',
      formData
    );
    return responseObs.pipe(first()).toPromise();
  }

  public swapSubscription(stripe_plan: any) {
    const formData = new FormData();
    formData.append('subscriptionId', stripe_plan);
    return this._createData('swap-subscription', formData);
  }

  public async cancelSubscription() {
    const formData = new FormData();
    const responseObs: Observable<any> = await this._createData(
      'cancel-subscription',
      formData
    );
    return responseObs.pipe(first()).toPromise();
  }

  async getUserSusbcription() {
    return (await this._getData('getUserSusbcription'))
      .pipe(first())
      .toPromise();
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
  public obtenerSubSectores(id:any) {
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
  public obtenerSectoresPerfil(id: any) {
    return this._getData('sectores-perfil/' + id);
  }

  public suspendedUser(user_id: any) {
    const formData = new FormData();
    formData.append('user_id', user_id);
    return this._createData('suspended-user', formData);
  }

  public obtenerSubSectoresPerfil(id: any) {
    return this._getData('sub-sectores-perfil/' + id);
  }

  /**
   * Comprobar si existe un usuario a partir de su nombre (único)
   * @param name
   */
  public existeUsuario(name: string) {
    return this._getData('existe-usuario/' + name);
  }

  public getAllSubscriptions() {
    return this._getData('get-subscriptions');
  }

  public hasSubscription(userId: number) {
    return this._getData(`has-subscription/${userId}`);
  }

  /**
   * Search by keys
   */
  public searchByKeys(key: string) {
    return this._getData('buscar-keys?keys=' + key);
  }

  /**
   * Get sectors by keys
   */
  public getSectorsByKeys(keyword: any, level?: string) {
    return this._getData(
      `sectores-keys?keys=${keyword}` + (level ? `&level=${level}` : '')
    );
  }

  /**
   * Get Bidders by score
   */
  public getBiddersByScore(id:number) {
    return this._getData('ofertantes-sector/' + id);
  }

  /**
   * Obtener las demandas del demandate a partir de su id
   * @param id
   */
  public getOpinionTypes() {
    return this._getData('get-opinions-types');
  }

  public getSubSectores(id:number) {
    return this._getData('get-sub-sectores-perfil/' + id);
  }

  /**
   * Obtener localidades
   */
  public obtenerLocalidades(id_provincia: any) {
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
  public enviarNotificacionPedirRecomendacion(title:string, desc:string, name:string) {
    const formData = new FormData();
    formData.append('mtitle', title);
    formData.append('mdesc', desc);
    formData.append('name', name);
    return this._createData('pedir-recomendacion', formData);
  }

  /**
   * Editar los datos del ofertante y su contraseña
   * @param nick
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
    nick: string,
    email: string,
    descripcion: string,
    telefono: string,

    direccion: string,
    direccion_resto: string,
    country: string,
    state: string,
    department: string,
    locality: string,
    place_id: string,

    sector: string,
    sub_sector: string,
    dni: string,
    link_url: string,
    imagen: string,
    pass: string
  ) {
    const formData = new FormData();
    formData.append('nick', nick);
    formData.append('descripcion', descripcion);
    formData.append('telefono', telefono);

    formData.append('direccion', direccion);
    formData.append('direccion_resto', direccion_resto);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('department', department);
    formData.append('locality', locality);
    formData.append('place_id', place_id);

    formData.append('sector', sector);
    formData.append('sub_sector', sub_sector);
    formData.append('dni', dni);
    formData.append('link_url', link_url);
    if (imagen !== undefined) formData.append('file', imagen);
    formData.append('email', email);
    formData.append('password', pass);
    return this._createData('editar-ofertante', formData);
  }

  /**
   * Editar los datos del ofertante
   * @param nick
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
    nick:string,
    email:string,
    descripcion:string,
    telefono:string,

    direccion:string,
    direccion_resto:string,
    country:string,
    state:string,
    department:string,
    locality:string,
    place_id:string,

    sector:string,
    sub_sector:string,
    dni:string,
    link_url:string,
    imagen:string,
  ) {
    const formData = new FormData();
    formData.append('nick', nick);
    formData.append('descripcion', descripcion);
    formData.append('telefono', telefono);

    formData.append('direccion', direccion);
    formData.append('direccion_resto', direccion_resto);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('department', department);
    formData.append('locality', locality);
    formData.append('place_id', place_id);

    formData.append('sector', sector);
    formData.append('sub_sector', sub_sector);
    formData.append('dni', dni);
    formData.append('link_url', link_url);
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
  public publicarOpinion(type_id:string, subsector_id:string, to_user_id:string) {
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
  public realizarOferta(nombre:string, descripcion:string, precio:string, id_demanda:string) {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('id_demanda', id_demanda);
    return this._createData('realizar-oferta', formData);
  }

  /**
   * Obtener las demandas relacionadas a una demanda del usuario
   * @param id_usuario
   * @param id_oferta
   */
  public obtenerDemandasRelacionadas(id_usuario:number, id_oferta:number) {
    return this._getData(
      'demandas-relacionadas/' + id_usuario + '/' + id_oferta
    );
  }

  /**
   * Obtener un perfil a partir de id
   * @param id
   */
  public obtenerPerfil(id:any) {
    return this._getData('obtener-perfil/' + id);
  }

  /**
   * Obtener las opiniones de un perfil segun id
   * @param id
   */
  public opinionesPerfil(id:any) {
    return this._getData('opiniones-perfil/' + id);
  }

  /**
   * Comprobar si existen opiniones
   * @param id_demandante
   */
  public comprobarOpinion(id_demandante:number) {
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
  public obtenerDemandasDemandante(id:any) {
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
  public borrarOferta(id:any) {
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
  public obtenerDemanda(id:number) {
    return this._getData('demanda/' + id);
  }

  /**
   * Registro del ofertante
   * @param nick
   * @param email
   * @param password
   * @param password_confirmation
   */
  public registro(params: any): any {
    const formData = new FormData();
    formData.append('nick', params.nick);
    formData.append('sector', params.sector);
    formData.append('sub_sector', params.sub_sector);
    formData.append('email', params.email);
    formData.append('password', params.password);
    formData.append('password_confirmation', params.password_confirmation);
    formData.append('role_id', '5');
    formData.append('idRecommender', params.idRecommender);
    formData.append('lang', params.lang);
    if (params.promoCode) {
      formData.append('promoCode', params.promoCode);
    }

    return this.http.post(environment.API_URL_AUTH + 'signup', formData);
  }

  handleError(error: any, caught: Observable<any>, endpoint: string) {
    // switch (error.status) {
    //   case 401: {
    //     // this.router.navigate(['login']);
    //     // this.utilities.showToast('Sesión expirada');
    //     // return throwError(error);
    //   }
    //   default: {
        return throwError(error);
    //   }
    // }
  }

  /**
   * Asignar el token de autentificación a la cabecera de las peticiones futuras
   */
  async getToken() {
    await this.utilities.getAccessTokenInfo().then((tokenInfo) => {
      return tokenInfo?.access_token;
    });
  }
  public getAllMessages(params: any) {
    const formData = new FormData();
    formData.append('room_id', params);
    return this._createData('getallmessages', formData);
  }

  public getChatOferta(id_demanda: string, id_ofertante:string) {
    const formData = new FormData();
    formData.append('id_demanda', id_demanda);
    formData.append('id_ofertante', id_ofertante);
    return this._createData('getchatoferta', formData);
  }

  public setMessage(user_id: string, person_id: string, message: string, room: string, timecreated:any) {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('person_id', person_id);
    formData.append('message', message);
    formData.append('room', room);
    formData.append('timecreated', timecreated);
    return this._createData('setmessage', formData);
  }

  public openChat(room: any) {
    const formData = new FormData();
    formData.append('room', room);
    return this._createData('openchat', formData);
  }

  public closeChat(room: any) {
    const formData = new FormData();
    formData.append('room', room);
    return this._createData('closechat', formData);
  }

  sendNotificacionNewMessage(id: number, message: string) {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('message', message);
    return this._createData('notify-new-message', formData);
  }

  unreadChatMessages: BehaviorSubject<UnreadMessages[]> = new BehaviorSubject<UnreadMessages[]>(null as unknown as UnreadMessages[]);

  public async getUnreadMessages() {
    this.unreadChatMessages.next(
      await (await this._getData('getUnreadMessages')).toPromise()
    );
  }
  public async setMessagesAsRead() {
    const formData = new FormData();
    const response: Observable<any> = await this._createData(
      'setMessagesAsRead',
      formData
    );
    await response.pipe(first()).toPromise();
    await this.getUnreadMessages();
  }

  /**
   * Comprobar si existe un usuario con un dni que le pasamos por parámetro
   * @param dni
   */
  public existeDNI(dni: string) {
    // Agrego esta linea porque sino cuando quiere borrar
    // su dni, no pasa párametro y provoca error
    dni = dni ? dni : 'null';
    return this._getData('existe-usuario-dni/' + dni);
  }

  /**
   * Comprobar si existe un usuario con un email que le pasamos por parámetro
   * @param email
   */
  public existeEmail(email: string) {
    return this._getData('existe-usuario-email/' + email);
  }

  /**
   * To verify Email account and save on user info
   * @param email
   */
  public async verifyEmail(id:number, email:string) {
    const lang = (<ILang>await ILangDEFAULTS.getCurrentLang(this.translateSvc))
      .lang;
    return await this._getData(`verify-email/${id}/${lang}/${email}`);
  }

  /**
   * To verify Email account and save on user info
   * @param email
   */
  public async emailVerified(id:any) {
    return await this._getData('email-verified/' + id);
  }

  /**
   * To Generate 2FA code
   */
  public async generate2FAcode() {
    return (await this._createData('generate2FAcode')).toPromise();
  }

  /**
   * To Verify 2FA code
   */
  public async verify2FAcode(code:string) {
    const data = new FormData();
    data.append('code', code);
    return (await this._createData('verify2FAcode', data)).toPromise();
  }
}
