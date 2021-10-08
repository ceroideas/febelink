import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
      private meta:Meta
    , private utils: UtilitiesService
  ) {}

  generateTags(
      title: string = 'Febelink',
      description: string = "El buscador de servicios profesionales",
      image: string = "http://test.febelink.com/assets/imgs/febelink-share-img.png" ){
    // El titulo en la pestaña
    this.utils.updateWebTitle( title );

    // this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    // this.meta.updateTag({ name: 'twitter:site', content: '@febelink' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:src', content: image });

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Febelink' });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:url', content: image });
    this.meta.updateTag({ property: 'og:url', content: 'febelink.com' });

    this.meta.updateTag({ name: 'description', content: description });

    // this.meta.updateTag({ itemprop: 'name', content: title });
    // this.meta.updateTag({ itemprop: 'description', content: description });
    // this.meta.updateTag({ itemprop: 'image', content: image });

  }
}