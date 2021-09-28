import { Component, OnInit } from '@angular/core';

import { Services} from './services.model';
import { serviceData } from './data';
import { Scraping } from 'src/app/components/link-preview/link-preview.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
/**
 * Services component
 */
export class ServicesComponent implements OnInit {

  serviceData: Services[];
  private url_prensa: Array<Scraping> = [
      { u: "https://cadenaser.com/emisora/2021/08/29/ser_malaga/1630226894_751094.html", t: '', d: '', i: '' },
      { u: "https://www.elespanol.com/malaga/economia/tecnologia/20210829/buscador-malagueno-gratuito-google-wallapop-permite-criptomonedas/607939739_0.html", t: '', d: '', i: '' },
      { u: "https://www.elconfidencialdigital.com/articulo/an/aumentar-ventas-que-aconsejan-expertos-febelink-encontrar-clientes/20210728164228265244.html", t: '', d: '', i: '' },
      { u: "https://es.cointelegraph.com/news/a-new-search-engine-for-professional-services-with-blockchain-technology-will-enter-the-international-market-this-next-month", t: '', d: '', i: '' }
  ];
  private url_blog: Array<Scraping> = [
      { u: "https://blog.febelink.com/", t: '', d: '', i: '' },
      { u: "https://blog.febelink.com/febelink-en-los-medios", t: '', d: '', i: '' },
      { u: "https://blog.febelink.com/que-son-los-buscadores-web", t: '', d: '', i: '' },
      { u: "https://blog.febelink.com/que-es-una-ico-de-criptomonedas", t: '', d: '', i: '' }
  ];
  private url_podcast: Array<Scraping> = [
      // { u: "https://podcasters.spotify.com/podcast/27euxhc9sJnLddV9PaXqX2/overview", t: '', d: '', i: '' },
      { u: "https://open.spotify.com/show/27euxhc9sJnLddV9PaXqX2?si=Z5tqZOh7T1uPr3fFsm1gfw&utm_source=whatsapp&dl_branch=1", t: '', d: '', i: '' },
      { u: "https://go.ivoox.com/rf/73515302", t: '', d: '', i: '' },
      { u: "https://www.ivoox.com/block-world-tour-motril-edition-2021-audios-mp3_rf_74746015_1.html", t: '', d: '', i: '' },
      { u: "https://www.ivoox.com/que-es-febelink-bitcoin-ya-oficial-legal-audios-mp3_rf_75226758_1.html", t: '', d: '', i: '' }
  ];
  private url_media: Array<Scraping> = this.url_prensa.concat( this.url_blog, this.url_podcast );

  constructor() { }

  ngOnInit(): void {
    // fetches the data
    this._fetchData();
  }

  /**
   * Service data
   */
  private _fetchData() {
    this.serviceData = serviceData;
  }
}
