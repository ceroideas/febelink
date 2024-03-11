import {Component, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CuentaProfesionalService } from 'src/app/pages/cuenta-profesional/Services/cuenta-profesional.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() currentUser;


  detached: boolean = false;
  detachBlock: boolean = false;
  reduced: boolean = false;
  wide: boolean = false;

  loadUser
  user
  constructor(
    private router: Router,  
    private location: Location,
    private authenticationService: AuthenticationService,
    private profAccountService: CuentaProfesionalService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlParts = event.url.split('/'); // Split the URL
     
        console.log(urlParts)
        if (event.url !== "/listado" && event.url !== "/" && !urlParts.includes('profile') && !urlParts.includes('wallet')  && !urlParts.includes('professions')  
         && !urlParts.includes('user')) {
          this.detachBlock = true;
          this.detached = true;
        } else {
          this.detachBlock = false;
          this.scroll();
        }
      }
    })
  }

  perfil;
  homePage;
  onImgError;

  irA(value) {
    window.location.href = value;
    // this.router.navigate([value]);
  };

  ngOnInit(){
    console.log(this.currentUser)
   window.addEventListener('scroll', this.scroll, true);
   window.addEventListener('resize', this.scroll, true);
  }

  async navigateNewServices() {
    let url = 'registro';
    if (this.authenticationService.isAuthenticated()) {
      const {response} = await this.profAccountService.getMyProfessions();
      if (response?.length > 0) {
        url = 'services';
      } else {
        url = 'professions';
      }
    }
    this.router.navigate([url]);
  }

  /**
   * handleButtonFilter()
   * Muestra los resultados de los filtros
  */
    scroll = (): void => {


  // Obtén la referencia al elemento con id 'capa-2'
    const capa2Element = document.getElementById('search-content1');


    console.log(capa2Element)
    const scrollTopValue = capa2Element.scrollTop;

    var miElemento = document.getElementById('miElemento');

      const distanceY = capa2Element.scrollTop;
      const shrinkOn = 100;
      const innerW = window.innerWidth;
  
     
     
      !this.detachBlock 
        ? this.detached = distanceY > shrinkOn
        : null;
  
      this.reduced = innerW <= 400;

   };
}
