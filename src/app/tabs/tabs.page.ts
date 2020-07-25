import { Component } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  perfil: any;
  public refreshTabs: any;

  constructor( private utilities: UtilitiesService,
               private api: ApiService,
               private router: Router ) {

                this.refreshTabs = this.api.refreshTab.subscribe(item => this.obtenerPerfil());

               }

  ionViewWillEnter(){
    this.obtenerPerfil();
  }
  
  async obtenerPerfil() {
    console.log("OBTIENE PERFIL TAB")
    await this.utilities.getUserData().then(data => {
      this.perfil = data;
    });
  }

  irA(p) {
    if(this.perfil === null){
      this.router.navigate(['login']);
    }else {
      this.router.navigate(['/tabs/tab4']);
    }
  }

}
