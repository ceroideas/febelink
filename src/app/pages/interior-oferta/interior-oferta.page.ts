import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController,NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import {NavigationExtras} from "@angular/router";
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-interior-oferta',
  templateUrl: './interior-oferta.page.html',
  styleUrls: ['./interior-oferta.page.scss'],
})
export class InteriorOfertaPage implements OnInit {
  exist_chat=false;
  oferta:any;
  constructor( public navParams: NavParams,
               private navCtrl: NavController,
               private modalCtrl: ModalController,
               private api: ApiService,
               private utilities: UtilitiesService,
               private router: Router,
               private storage: Storage ) {

    this.oferta = navParams.get('oferta');

  }

  ngOnInit() {

  }

  /**
   * Método para salir del modal
   */
  public closeModal():void{
    this.modalCtrl.dismiss();
  }

  /**
   * Enviamos la respuesta al servidor
   */
  async responderOferta(respuesta){
    //Respuesta 0, oferta denegada, respuesta 1, oferta aceptada
    (await this.api.responderOferta(respuesta,this.oferta.id)).subscribe( async resp => {

      let title='Han respondido a tu oferta';
      let desc:string;
      if(respuesta===0){
        desc='Han declinado tu oferta ('+this.oferta.nombre+')';
      }else{
        desc='Han aceptado tu oferta ('+this.oferta.nombre+')';
      }

      (await this.api.enviarNotificationOfertaRespondida(title,desc,this.oferta.id_ofertante,respuesta)).subscribe( resp => {

        this.modalCtrl.dismiss();
        this.utilities.showToast("Se ha respondido a la oferta correctamente");

      });

    });

  }

  /**
   * Para ir al perfil pero que se pueda contactar con el si acepta
   */
  public irAPerfil():void {
    this.closeModal();
    this.router.navigate(['perfil-demandante/'+this.oferta.id_ofertante],{ queryParams: { 'id_perfil': this.oferta.id_ofertante, 'contacto':this.oferta.estado != 3 }});
  }

  viewChat() {

    this.storage.get('userData').then(res => {
      if (res) {

      let room_id = this.oferta.id_ofertante+""+this.oferta.id_demanda+""+res.id;

        let navigationExtras: NavigationExtras = {
          queryParams: {
            user_id: JSON.stringify(res.id),
            person_name: JSON.stringify('Chat'),
            person_id: JSON.stringify(this.oferta.id_ofertante),
            room_id: JSON.stringify(room_id),
            create: JSON.stringify(res.id),
          }
        };
        this.modalCtrl.dismiss();
        this.navCtrl.navigateForward('chat', navigationExtras);
      }
    });

  }

}
