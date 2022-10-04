import {Injectable} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {SEOFebelink} from '../models/seo.model';
import {UtilitiesService} from './utilities.service';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  seoDEFAULT: SEOFebelink = {
    title: 'Febelink | Tienda de servicios',
    description:
      'Febelink es el buscador de servicios profesionales, el sitio para compartir y encontrar servicios, y realizar pagos con criptomonedas',
    image: 'https://febelink.com/assets/imgs/febelink-share-img.png',
    url: 'febelink.com',
  };
  seoPrevoius: SEOFebelink = {
    title: this.seoDEFAULT.title,
    description: this.seoDEFAULT.description,
    image: this.seoDEFAULT.image,
    url: this.seoDEFAULT.url,
  };

  constructor(private meta: Meta, private utils: UtilitiesService) {
  }

  generateTags(seo: SEOFebelink) {
    // Guardo las tags anteriores en caso de que tenga que volver a asignarlas
    this.seoPrevoius = this.getTags();

    // El titulo en la pestaña
    this.utils.updateWebTitle(seo.title);

    // this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    // this.meta.updateTag({ name: 'twitter:site', content: '@febelink' });
    this.meta.updateTag({name: 'twitter:title', content: seo.title});
    this.meta.updateTag({
      name: 'twitter:description',
      content: seo.description,
    });
    this.meta.updateTag({name: 'twitter:image', content: seo.image});
    this.meta.updateTag({name: 'twitter:image:src', content: seo.image});

    this.meta.updateTag({property: 'og:type', content: 'website'});
    this.meta.updateTag({property: 'og:site_name', content: 'Febelink'});
    this.meta.updateTag({property: 'og:title', content: seo.title});
    this.meta.updateTag({
      property: 'og:description',
      content: seo.description,
    });
    this.meta.updateTag({property: 'og:image', content: seo.image});
    this.meta.updateTag({property: 'og:image:url', content: seo.image});
    this.meta.updateTag({property: 'og:url', content: seo.url});

    this.meta.updateTag({name: 'description', content: seo.description});

    // this.meta.updateTag({ itemprop: 'name', content: title });
    // this.meta.updateTag({ itemprop: 'description', content: description });
    // this.meta.updateTag({ itemprop: 'image', content: image });
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
}
