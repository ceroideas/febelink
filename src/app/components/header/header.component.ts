import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { AuthenticationService } from './../../services/authentication/authentication.service';
import { CuentaProfesionalService } from './../../pages/cuenta-profesional/Services/cuenta-profesional.service';
import { getDocument, getWindow } from 'ssr-window';
import { NotificationService } from './../../services/notification.service';
import { SearchforyouService } from '../../services/searchforyou.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() currentUser : any;

  detached: boolean = false;
  detachBlock: boolean = false;
  reduced: boolean = false;
  wide: boolean = false;
  bellContent: boolean = false;

  loadUser: any = {}
  user: any = {}

  window = getWindow();
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,  
    private location: Location,
    private authenticationService: AuthenticationService,
    private profAccountService: CuentaProfesionalService,
    private not: NotificationService,
    private searchForYouService: SearchforyouService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlParts = event.url.split('/'); // Split the URL
     
        if (
          // event.url !== "/listado" && 
          event.url !== "/search" && 
          event.url !== "/" && 
          !urlParts.includes('profile') 
          && !urlParts.includes('services') 
          && !urlParts.includes('wallet')  && !urlParts.includes('professions')  
          && !urlParts.includes('subscriptions')
          && !urlParts.includes('user')
          && !urlParts.includes('servicio')) {
          this.detachBlock = true;
          this.detached = true;
        } else {
          this.detachBlock = false;
          this.scroll();
        }
      }
    })
  }

  perfil: any = {}
  homePage: any = {}
  onImgError: any = {}
  cnot:any;
  notis:any;
  openDiv:any;

  irA(value: any) {
    this.window.location.href = value;
    // this.router.navigate([value]);
  };

  ngOnInit(){
    if ( isPlatformBrowser(this.platformId) ) {
      this.window.addEventListener('scroll', this.scroll, true);
      this.window.addEventListener('resize', this.scroll, true);
    }
    /*if (this.authenticationService.isAuthenticated()) {  
        this.searchForYouService.getUserNotifications([], []).then((res: any) => {
            this.cnot = res.response.count;
            this.notis = res.response.data;
        })
        .catch((error) => {
            console.log(error)
        });
    }*/
  }

  openDivNotifications(){
    this.openDiv = !this.openDiv;
  }

    goNotifications() {
        this.openDiv = !this.openDiv;
        this.bellContent = !this.bellContent;
        this.router.navigate(['/notifications']);
    }

    toggleBellContent(){
        this.bellContent = !this.bellContent;
    }

    async readNot(n:any){
        let data = {
            notification_id: n.id
        } 
        try {
            await this.searchForYouService.readUserNotification(data);
            /*this.searchForYouService.getUserNotifications([], []).then((res: any) => {
                this.cnot = res.response.count;
                this.notis = res.response.data;

                if(n.action_type == 2){
                    window.open('https://www.febelink.com/profile', '_blank');
                }else{
                    if(n.action_type == 3){
                        window.open('https://www.febelink.com/servicios/'+n.proffession_name+'/'+n.province_name, '_blank');
                    }else{
                        if(n.action_type == 4){
                            window.open('https://www.febelink.com/servicios/'+n.custom_url, '_blank');
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            });*/
        } catch (error) {
            // this.loadingRequest = false;
        }

    }

  async navigateNewServices() {
    let url = 'registro';
    if (this.authenticationService.isAuthenticated()) {
      const {response} = await this.profAccountService.getMyProfessions();
      if (response.professions?.length > 0) {
        url = 'services';
      } else {
        url = 'professions';
      }
    }
    this.router.navigate([url]);
  }
  
  async navigateToFavorites() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['favoritos']);
    } else {
      this.router.navigate(['registro']);
    }
  }

  /**
   * handleButtonFilter()
   * Muestra los resultados de los filtros
  */
    scroll = (): void => {

    const capa2Elements = this.document.getElementsByClassName('search-content');

    for (var i = 0; i < capa2Elements.length; i++) {
      const distanceY = capa2Elements[i].scrollTop;;  // Usa this.window.pageYOffset para obtener la posición de desplazamiento de la ventana
    
      const shrinkOn = 30;
      const innerW = this.window.innerWidth;

      // Asumiendo que 'detachBlock' es una propiedad válida, de lo contrario, ajusta según tu lógica
      !this.detachBlock
        ? this.detached = distanceY > shrinkOn
        : null;
    
      this.reduced = innerW <= 400;
    }
     

   };
}
