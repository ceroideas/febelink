import {Injectable, Inject} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {SEOFebelink} from '../models/seo.model';
import {UtilitiesService} from './utilities.service';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  seoDEFAULT: SEOFebelink = {
    title: 'Febelink ¿Qué necesitas? Ofertas de servicios profesionales',
    description:
      'Febelink es el buscador universal de servicios profesionales. Encuentra asesores, reformas, estética, salud o formación. Busca, compara y compra en un clic',
    image: 'https://www.febelink.com/assets/imgs/febelinksuperpro.jpg',
    url: 'www.febelink.com',
  };
  seoPrevoius: SEOFebelink = {
    title: this.seoDEFAULT.title,
    description: this.seoDEFAULT.description,
    image: this.seoDEFAULT.image,
    url: this.seoDEFAULT.url,
  };

  constructor(
    private meta: Meta,
    private title: Title,
    private utils: UtilitiesService,
    @Inject(DOCUMENT) private dom: Document,
    private router: Router
  ) {
  }

  generateTags(seo: SEOFebelink) {

    // Guardo las tags anteriores en caso de que tenga que volver a asignarlas
    // this.seoPrevoius = this.getTags();

    //@ts-ignore
    
    this.title.setTitle(seo.title || this.seoPrevoius.title);

    if ( seo.image == null || seo.image == undefined  || seo.image == ''  || seo.image == 'null' || seo.image == 'undefined' ) {
      seo.image = 'https://www.febelink.com/assets/imgs/febelinksuperpro.jpg';
      this.seoPrevoius.image = 'https://www.febelink.com/assets/imgs/febelinksuperpro.jpg';
    }

    

    // El titulo en la pestaña

    //@ts-ignore
    
    this.utils.updateWebTitle(seo.title || this.seoPrevoius.title);
    

    // this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    // this.meta.updateTag({ name: 'twitter:site', content: '@febelink' });
    //@ts-ignore
    
    this.meta.updateTag({name: 'twitter:title', content: seo.title || this.seoPrevoius.title});
    //@ts-ignore
    
    this.meta.updateTag({
      name: 'twitter:description',
      content: seo.description || this.seoPrevoius.description,
    });
    //@ts-ignore
    
    this.meta.updateTag({name: 'twitter:image', content: seo.image || this.seoPrevoius.image});
    //@ts-ignore
    
    this.meta.updateTag({name: 'twitter:image:src', content: seo.image || this.seoPrevoius.image});

    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:site_name', content: 'Febelink'});
    //@ts-ignore
    
    this.meta.updateTag({property: 'og:title', content: seo.title || this.seoPrevoius.title});
    //@ts-ignore
    
    this.meta.updateTag({
      property: 'og:description',
      content: seo.description,
    });
    //@ts-ignore
    
    this.meta.updateTag({property: 'og:image', content: seo.image || this.seoPrevoius.image});
    //@ts-ignore
    
    this.meta.updateTag({property: 'og:image:url', content: seo.image || this.seoPrevoius.image});
    //@ts-ignore
    
    this.meta.updateTag({property: 'og:url', content: seo.url || this.seoPrevoius.url});
    //@ts-ignore
    
    this.meta.updateTag({name: 'description', content: seo.description || this.seoPrevoius.description});

  
  }

  getTags(): SEOFebelink {
    let title: string | null = this.utils.getWebTitle();
    let description: HTMLMetaElement | null =
      this.meta.getTag('name=description');
    let image: HTMLMetaElement | null = this.meta.getTag('og=image');
    let url: HTMLMetaElement | null = this.meta.getTag('og=url');
    return {
      title: !title ? this.seoDEFAULT.title : title,
      description: !description
        ? this.seoDEFAULT.description
        : description.content,
      image: !image ? this.seoDEFAULT.image : image.content,
      url: !url ? this.seoDEFAULT.url : url.content,
    };
  }

  setPreviousTags() {
    // Si tiene tags previas, asigno dichas tags para volver a su valor por defecto
    if (this.seoPrevoius) {
      this.generateTags(this.seoPrevoius);
    }
  }

  setCanonical(url: string) {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', environment.WEB_URL + url);
  }

  addPageCanonical() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute(
      'href',
      environment.WEB_URL + this.router.url.substring(1)
    );
  }
}
