import {Component, Input} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import { SearchService } from '../services/search.service';
import { ToastSvc } from '../../services/toast.service';
import { UtilitiesService } from '../../services/utilities.service';
import { environment } from '../../../environments/environment';

export interface SearchCardType {
  link: string;
  title: string;
  description: string;
  imageURL: string;
}

@Component({
  selector: 'search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent {
  @Input() data: SearchCardType | null = null;
  @Input() searchTerm: string| null = null

  urlWsrv: string = environment.baseWebUrlWsrv;

  constructor(private router: Router, private searchSvc: SearchService, private toastSvc: ToastSvc, private utilities: UtilitiesService) {
    
  }

  irA(p: string): void {
    this.router.navigate([p]);
  }

  async sendSearchContactRequest() {
    // this.router.navigate(['/pedir-presupuesto-gratis'],  { queryParams: { params: this.data.title }});

    const queryParams: any = {};
    queryParams.search = JSON.stringify(this.data)
    const navigationExtras: NavigationExtras = {
      fragment: queryParams
    };

    this.router.navigate(['/pedir-presupuesto-gratis'], navigationExtras);
    
    // const {response, error} = await this.searchSvc.contact4Search(this.searchTerm, this.data.link, this.data.title, this.data.description);
    // if (response) {
    //   await this.toastSvc.show('La solicitud de contacto ha sido enviada correctamente. Los profesionales seleccionados se ' +
    //     'pondrán en contacto contigo muy pronto.');

    //   await this.utilities.getUserData().then((data) => {
    //     if (!data) {
    //       this.router.navigate(['/registro']);
    //     }
    //   });
    // }
    // if (error) {
    //   await this.toastSvc.show('Ha ocurrido un error al enviar la solicitud. Por favor, inténtelo de nuevo y si el error ' +
    //     'persiste póngase en contacto con el equipo de soporte a través del email: info@febelink.com');
    // }
  }
}
