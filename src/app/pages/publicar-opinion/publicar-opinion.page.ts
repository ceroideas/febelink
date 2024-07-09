import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-publicar-opinion',
  templateUrl: './publicar-opinion.page.html',
  styleUrls: ['./publicar-opinion.page.scss'],
})
export class PublicarOpinionPage implements OnInit {
//@ts-ignore
  form: UntypedFormGroup;
  id_demandante: any;
  opinion_types: any[] = [];
  subsectores: any[]= [];

  constructor( public navParams: NavParams,
               private api: ApiService,
               private utilities: UtilitiesService,
               private formBuilder: UntypedFormBuilder,
               private modalCtrl: ModalController
               ) { 

    this.id_demandante = navParams.get('id_demandante');

  }

  /**
   * Inicializamos el formGroup
   */
  public async ngOnInit() {
    this.form = this.formBuilder.group({
      type_id: ['', Validators.required],
      subsector_id: ['', Validators.required]
    });

    (await this.api.getOpinionTypes()).subscribe( async (res: any[][]) => {

      (await this.api.getSubSectores(this.navParams.get('id_demandante'))).subscribe( (subsectores: any[]) => {

        this.subsectores = subsectores;
        console.log(this.subsectores);
        this.opinion_types = res[0];

      });

    });
  }

  /**
   * Método para cerrar el modal
   */
  public closeModal(): void {
    this.modalCtrl.dismiss();
  }

  /**
   * Enviamos al servidor la opinion
   */
  async submitForm() {
    let type_id = this.form.get('type_id')?.value;
    let subsector_id = this.form.get('subsector_id')?.value;

    this.utilities.showLoading();
    (await this.api.publicarOpinion(type_id, subsector_id, this.id_demandante)).subscribe( () => {

      this.utilities.dismissLoading();
      this.utilities.showToast('Se ha publicado la opinión correctamente');
      this.closeModal();

    },() => {
      this.utilities.dismissLoading();
      this.utilities.showToast('No se ha podido publicar la opinión');
    });
    

  }

}
