import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {SearchService} from '../../services/search.service';
import {IKeywords} from '../../models/search.model';
import {SearchProductCardType} from '../product-card/product-card.component';
import {SearchCardType} from '../search-card/search-card.component';
import {AuthenticationService} from '../../../../services/authentication/authentication.service';
import {SeoService} from 'src/app/services/seo.service';
import {Title} from '@angular/platform-browser';

export interface SearchType {
  services: SearchProductCardType[];
  offers: SearchProductCardType[];
  users: any; // ToDo: Add type here,
  otherResults: SearchCardType[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewInit {
  @Input() showSearchbar: boolean = true;
  @Input() searchText: string = '';
  public data: any;
  @Input() type: string = '';
  @Output() generalTitle = new EventEmitter<string>();

  public slideOpts = {
    initialSlide: 1,
    speed: 400,
  };

  recommendations;
  searchResponse: SearchType;
  locationFilter: string;
  metaLocationFilter: string;
  resultTitle = 'Resultados';
  metaDescription = '';
  unitTypes = [
    {id: 1, name: 'Día', shorthand: 'día', lang: 'ES'},
    {id: 2, name: 'Mes', shorthand: 'mes', lang: 'ES'},
    {id: 3, name: 'Año', shorthand: 'año', lang: 'ES'},
    {id: 4, name: 'Unidad', shorthand: 'ud.', lang: 'ES'},
    {id: 5, name: 'Hora', shorthand: 'hora', lang: 'ES'},
    {id: 6, name: 'Consulta', shorthand: 'consulta', lang: 'ES'},
    {id: 7, name: 'Sesión', shorthand: 'sesión', lang: 'ES'},
    {id: 8, name: 'Jornada', shorthand: 'jornada', lang: 'ES'},
    {id: 9, name: 'Oferta', shorthand: 'oferta', lang: 'ES'},
    {id: 10, name: 'Campaña', shorthand: 'campaña', lang: 'ES'},
    {id: 11, name: 'Porcentaje', shorthand: '%', lang: 'ES'},
    {id: 12, name: 'Donación', shorthand: 'donación', lang: 'ES'},
    {id: 13, name: 'Presupuesto', shorthand: 'presupuesto', lang: 'ES'},
  ]; // ToDo: Get this from the priceType Collection

  services = [
    {name: 'Asesores', icon: 'assets/imgs/home/services-assistant.svg', searchTerm: 'asesores'},
    {name: 'Deportes', icon: 'assets/imgs/home/services-sport.svg', searchTerm: 'deportes'},
    {name: 'Belleza y estética', icon: 'assets/imgs/home/services-beauty.svg', searchTerm: 'belleza-y-estética'},
    {name: 'Formación', icon: 'assets/imgs/home/services-learning.svg', searchTerm: 'formación'},
    {name: 'Reformas', icon: 'assets/imgs/home/services-reforms.svg', searchTerm: 'reformas'},
    {name: 'Ocio', icon: 'assets/imgs/home/services-entertainment.svg', searchTerm: 'ocio-y-fiestas'},
    {name: 'Diseño y programación', icon: 'assets/imgs/home/services-development.svg', searchTerm: 'diseño-y-programacion'},
    {name: 'Salud', icon: 'assets/imgs/home/services-health.svg', searchTerm: 'salud'},
    {name: 'Abogados', icon: 'assets/imgs/home/services-lawyer.svg', searchTerm: 'abogados'},
    {name: 'Talleres', icon: 'assets/imgs/home/services-car.svg', searchTerm: 'taller-mecanico'},
  ];

  sectors = [
    {title: 'Asesores fiscales', link: 'asesores-fiscales-en', imageURL: 'assets/imgs/home/sector-assistant.jpeg'},
    {title: 'Fontaneros', link: 'fontanero-en', imageURL: 'assets/imgs/home/sector-plumber.jpeg'},
    {title: 'Profesor particular', link: 'profesor-particular-en', imageURL: 'assets/imgs/home/sector-learning.jpeg'},
    {title: 'Fisioterapeutas', link: 'fisioterapeuta-en', imageURL: 'assets/imgs/home/sector-health.jpeg'},
    {title: 'Podólogos', link: 'podólogos-en', imageURL: 'assets/imgs/home/foot-health.jpg'},
    {title: 'Mecánicos', link: 'taller-mecánico-en', imageURL: 'assets/imgs/home/sector-car.jpeg'},
    {title: 'Desarrolladores', link: 'empresa-de-programacion-y-desarrollo-en', imageURL: 'assets/imgs/home/sector-technology.jpeg'},
    {title: 'Diseñador gráfico', link: 'empresa-de-diseño-grafico-en', imageURL: 'assets/imgs/home/ux-designer.jpg'},
    {title: 'Pintores', link: 'empresa-de-pintores-en', imageURL: 'assets/imgs/home/painters.jpg'},
    {title: 'Cuidadores', link: 'empresa-de-cuidadores-en', imageURL: 'assets/imgs/home/sector-care.jpeg'},
  ];

  locationLinks = [
    {title: 'Álava', link: 'servicios-profesionales-en-Álava'},
    {title: 'Albacete', link: 'servicios-profesionales-en-Albacete'},
    {title: 'Alicante', link: 'servicios-profesionales-en-Alicante'},
    {title: 'Almería', link: 'servicios-profesionales-en-Almería'},
    {title: 'Asturias', link: 'servicios-profesionales-en-Asturias'},
    {title: 'Ávila', link: 'servicios-profesionales-en-Ávila'},
    {title: 'Badajoz', link: 'servicios-profesionales-en-Badajoz'},
    {title: 'Barcelona', link: 'servicios-profesionales-en-Barcelona'},
    {title: 'Burgos', link: 'servicios-profesionales-en-Burgos'},
    {title: 'Cáceres', link: 'servicios-profesionales-en-Cáceres'},
    {title: 'Cádiz', link: 'servicios-profesionales-en-Cádiz'},
    {title: 'Cantabria', link: 'servicios-profesionales-en-Cantabria'},
    {title: 'Castellón', link: 'servicios-profesionales-en-Castellón'},
    {title: 'Ceuta', link: 'servicios-profesionales-en-Ceuta'},
    {title: 'Ciudad Real', link: 'servicios-profesionales-en-Ciudad-Real'},
    {title: 'Córdoba', link: 'servicios-profesionales-en-Córdoba'},
    {title: 'Cuenca', link: 'servicios-profesionales-en-Cuenca'},
    {title: 'Gerona', link: 'servicios-profesionales-en-Gerona'},
    {title: 'Granada', link: 'servicios-profesionales-en-Granada'},
    {title: 'Guadalajara', link: 'servicios-profesionales-en-Guadalajara'},
    {title: 'Guipúzcoa', link: 'servicios-profesionales-en-Guipúzcoa'},
    {title: 'Huelva', link: 'servicios-profesionales-en-Huelva'},
    {title: 'Huesca', link: 'servicios-profesionales-en-Huesca'},
    {title: 'Islas Baleares', link: 'servicios-profesionales-en-Islas-Baleares'},
    {title: 'Jaén', link: 'servicios-profesionales-en-Jaén'},
    {title: 'La Coruña', link: 'servicios-profesionales-en-La-Coruña'},
    {title: 'La Rioja', link: 'servicios-profesionales-en-La-Rioja'},
    {title: 'Las Palmas', link: 'servicios-profesionales-en-Las-Palmas'},
    {title: 'León', link: 'servicios-profesionales-en-León'},
    {title: 'Lleida', link: 'servicios-profesionales-en-Lleida'},
    {title: 'Lugo', link: 'servicios-profesionales-en-Lugo'},
    {title: 'Madrid', link: 'servicios-profesionales-en-Madrid'},
    {title: 'Málaga', link: 'servicios-profesionales-en-Málaga'},
    {title: 'Melilla', link: 'servicios-profesionales-en-Melilla'},
    {title: 'Murcia', link: 'servicios-profesionales-en-Murcia'},
    {title: 'Navarra', link: 'servicios-profesionales-en-Navarra'},
    {title: 'Orense', link: 'servicios-profesionales-en-Orense'},
    {title: 'Palencia', link: 'servicios-profesionales-en-Palencia'},
    {title: 'Pontevedra', link: 'servicios-profesionales-en-Pontevedra'},
    {title: 'Salamanca', link: 'servicios-profesionales-en-Salamanca'},
    {title: 'Santa Cruz de Tenerife', link: 'servicios-profesionales-en-Santa-Cruz-de-Tenerife'},
    {title: 'Segovia', link: 'servicios-profesionales-en-Segovia'},
    {title: 'Sevilla', link: 'servicios-profesionales-en-Sevilla'},
    {title: 'Soria', link: 'servicios-profesionales-en-Soria'},
    {title: 'Tarragona', link: 'servicios-profesionales-en-Tarragona'},
    {title: 'Teruel', link: 'servicios-profesionales-en-Teruel'},
    {title: 'Toledo', link: 'servicios-profesionales-en-Toledo'},
    {title: 'Valencia', link: 'servicios-profesionales-en-Valencia'},
    {title: 'Valladolid', link: 'servicios-profesionales-en-Valladolid'},
    {title: 'Vizcaya', link: 'servicios-profesionales-en-Vizcaya'},
    {title: 'Zamora', link: 'servicios-profesionales-en-Zamora'},
    {title: 'Zaragoza', link: 'servicios-profesionales-en-Zaragoza'},
    {title: 'Palma de Mallorca', link: 'servicios-profesionales-en-mallorca'},
    {title: 'Menorca', link: 'servicios-profesionales-en-menorca'},
    {title: 'Ibiza', link: 'servicios-profesionales-en-ibiza'},
    {title: 'Lanzarote', link: 'servicios-profesionales-en-lanzarote'},
    {title: 'Fuerteventura', link: 'servicios-profesionales-en-fuerteventura'},
    {title: 'Oviedo', link: 'servicios-profesionales-en-oviedo'},
    {title: 'Gijón', link: 'servicios-profesionales-en-gijon'},
  ];

  locationFilterLink = [
    {location: 'Málaga', title: 'Asesor en Málaga', link: 'asesor-en-malaga', sector: 'Asesores'},
    {location: 'Málaga', title: 'Fontanero en Málaga', link: 'fontanero-en-malaga', sector: 'Fontaneros'},
    {location: 'Málaga', title: 'Servicio de limpieza en Málaga', link: 'servicio-de-limpieza-en-malaga', sector: 'Empresas de limpieza'},
    {location: 'Málaga', title: 'Electricista en Málaga', link: 'electricista-en-malaga', sector: 'Electricistas'},
    {location: 'Málaga', title: 'Clases particulares en Málaga', link: 'clases-particulares-en-malaga', sector: 'Clases particulares'},
    {location: 'Málaga', title: 'Entrenador personal en Málaga', link: 'entrenador-personal-en-malaga', sector: 'Entrenadores personales'},
    {location: 'Málaga', title: 'Traductor en Málaga', link: 'traductor-en-malaga', sector: 'Traductores'},
    {location: 'Málaga', title: 'Fotógrafo en Málaga', link: 'fotografo-en-malaga', sector: 'Fotógrafos'},
    {location: 'Málaga', title: 'Contable en Málaga', link: 'contable-en-malaga', sector: 'Contables'},
    {location: 'Málaga', title: 'Mudanza en Málaga', link: 'mudanza-en-malaga', sector: 'Mudanzas'},
    {location: 'Madrid', title: 'Asesor en Madrid', link: 'asesor en madrid', sector: 'Asesores'},
    {location: 'Madrid', title: 'Fontanero en Madrid', link: 'fontanero en madrid', sector: 'Fontaneros'},
    {location: 'Madrid', title: 'Servicio de limpieza en Madrid', link: 'servicio de limpieza en madrid', sector: 'Empresas de limpieza'},
    {location: 'Madrid', title: 'Electricista en Madrid', link: 'electricista en madrid', sector: 'Electricistas'},
    {location: 'Madrid', title: 'Clases particulares en Madrid', link: 'clases particulares en madrid', sector: 'Clases particulares'},
    {location: 'Madrid', title: 'Entrenador personal en Madrid', link: 'entrenador personal en madrid', sector: 'Entrenadores personales'},
    {location: 'Madrid', title: 'Traductor en Madrid', link: 'traductor en madrid', sector: 'Traductores'},
    {location: 'Madrid', title: 'Fotógrafo en Madrid', link: 'fotografo en madrid', sector: 'Fotógrafos'},
    {location: 'Madrid', title: 'Contable en Madrid', link: 'contable en madrid', sector: 'Contables'},
    {location: 'Madrid', title: 'Mudanza en Madrid', link: 'mudanza en madrid', sector: 'Mudanzas'},
    {location: 'Sevilla', title: 'Asesor en Sevilla', link: 'asesor en sevilla', sector: 'Asesores'},
    {location: 'Sevilla', title: 'Fontanero en Sevilla', link: 'fontanero en sevilla', sector: 'Fontaneros'},
    {
      location: 'Sevilla',
      title: 'Servicio de limpieza en Sevilla',
      link: 'servicio de limpieza en sevilla',
      sector: 'Empresas de limpieza'
    },
    {location: 'Sevilla', title: 'Electricista en Sevilla', link: 'electricista en sevilla', sector: 'Electricistas'},
    {location: 'Sevilla', title: 'Clases particulares en Sevilla', link: 'clases particulares en sevilla', sector: 'Clases particulares'},
    {
      location: 'Sevilla',
      title: 'Entrenador personal en Sevilla',
      link: 'entrenador personal en sevilla',
      sector: 'Entrenadores personales'
    },
    {location: 'Sevilla', title: 'Traductor en Sevilla', link: 'traductor en sevilla', sector: 'Traductores'},
    {location: 'Sevilla', title: 'Fotógrafo en Sevilla', link: 'fotografo en sevilla', sector: 'Fotógrafos'},
    {location: 'Sevilla', title: 'Contable en Sevilla', link: 'contable en sevilla', sector: 'Contables'},
    {location: 'Sevilla', title: 'Mudanza en Sevilla', link: 'mudanza en sevilla', sector: 'Mudanzas'},
    {location: 'Granada', title: 'Asesor en Granada', link: 'asesor en granada', sector: 'Asesores'},
    {location: 'Granada', title: 'Fontanero en Granada', link: 'fontanero en granada', sector: 'Fontaneros'},
    {
      location: 'Granada',
      title: 'Servicio de limpieza en Granada',
      link: 'servicio de limpieza en granada',
      sector: 'Empresas de limpieza'
    },
    {location: 'Granada', title: 'Electricista en Granada', link: 'electricista en granada', sector: 'Electricistas'},
    {location: 'Granada', title: 'Clases particulares en Granada', link: 'clases particulares en granada', sector: 'Clases particulares'},
    {
      location: 'Granada',
      title: 'Entrenador personal en Granada',
      link: 'entrenador personal en granada',
      sector: 'Entrenadores personales'
    },
    {location: 'Granada', title: 'Traductor en Granada', link: 'traductor en granada', sector: 'Traductores'},
    {location: 'Granada', title: 'Fotógrafo en Granada', link: 'fotografo en granada', sector: 'Fotógrafos'},
    {location: 'Granada', title: 'Contable en Granada', link: 'contable en granada', sector: 'Contables'},
    {location: 'Granada', title: 'Mudanza en Granada', link: 'mudanza en granada', sector: 'Mudanzas'},
    {location: 'Jaén', title: 'Asesor en Jaén', link: 'asesor en jaen', sector: 'Asesores'},
    {location: 'Jaén', title: 'Fontanero en Jaén', link: 'fontanero en jaen', sector: 'Fontaneros'},
    {location: 'Jaén', title: 'Servicio de limpieza en Jaén', link: 'servicio de limpieza en jaen', sector: 'Empresas de limpieza'},
    {location: 'Jaén', title: 'Electricista en Jaén', link: 'electricista en jaen', sector: 'Electricistas'},
    {location: 'Jaén', title: 'Clases particulares en Jaén', link: 'clases particulares en jaen', sector: 'Clases particulares'},
    {location: 'Jaén', title: 'Entrenador personal en Jaén', link: 'entrenador personal en jaen', sector: 'Entrenadores personales'},
    {location: 'Jaén', title: 'Traductor en Jaén', link: 'traductor en jaen', sector: 'Traductores'},
    {location: 'Jaén', title: 'Fotógrafo en Jaén', link: 'fotografo en jaen', sector: 'Fotógrafos'},
    {location: 'Jaén', title: 'Contable en Jaén', link: 'contable en jaen', sector: 'Contables'},
    {location: 'Jaén', title: 'Mudanza en Jaén', link: 'mudanza en jaen', sector: 'Mudanzas'},
    {location: 'Córdoba', title: 'Asesor en Córdoba', link: 'asesor en cordoba', sector: 'Asesores'},
    {location: 'Córdoba', title: 'Fontanero en Córdoba', link: 'fontanero en cordoba', sector: 'Fontaneros'},
    {
      location: 'Córdoba',
      title: 'Servicio de limpieza en Córdoba',
      link: 'servicio de limpieza en cordoba',
      sector: 'Empresas de limpieza'
    },
    {location: 'Córdoba', title: 'Electricista en Córdoba', link: 'electricista en cordoba', sector: 'Electricistas'},
    {location: 'Córdoba', title: 'Clases particulares en Córdoba', link: 'clases particulares en cordoba', sector: 'Clases particulares'},
    {
      location: 'Córdoba',
      title: 'Entrenador personal en Córdoba',
      link: 'entrenador personal en cordoba',
      sector: 'Entrenadores personales'
    },
    {location: 'Córdoba', title: 'Traductor en Córdoba', link: 'traductor en cordoba', sector: 'Traductores'},
    {location: 'Córdoba', title: 'Fotógrafo en Córdoba', link: 'fotografo en cordoba', sector: 'Fotógrafos'},
    {location: 'Córdoba', title: 'Contable en Córdoba', link: 'contable en cordoba', sector: 'Contables'},
    {location: 'Córdoba', title: 'Mudanza en Córdoba', link: 'mudanza en cordoba', sector: 'Mudanzas'},
    {location: 'Almería', title: 'Asesor en Almería', link: 'asesor en almeria', sector: 'Asesores'},
    {location: 'Almería', title: 'Fontanero en Almería', link: 'fontanero en almeria', sector: 'Fontaneros'},
    {
      location: 'Almería',
      title: 'Servicio de limpieza en Almería',
      link: 'servicio de limpieza en almeria',
      sector: 'Empresas de limpieza'
    },
    {location: 'Almería', title: 'Electricista en Almería', link: 'electricista en almeria', sector: 'Electricistas'},
    {location: 'Almería', title: 'Clases particulares en Almería', link: 'clases particulares en almeria', sector: 'Clases particulares'},
    {
      location: 'Almería',
      title: 'Entrenador personal en Almería',
      link: 'entrenador personal en almeria',
      sector: 'Entrenadores personales'
    },
    {location: 'Almería', title: 'Traductor en Almería', link: 'traductor en almeria', sector: 'Traductores'},
    {location: 'Almería', title: 'Fotógrafo en Almería', link: 'fotografo en almeria', sector: 'Fotógrafos'},
    {location: 'Almería', title: 'Contable en Almería', link: 'contable en almeria', sector: 'Contables'},
    {location: 'Almería', title: 'Mudanza en Almería', link: 'mudanza en almeria', sector: 'Mudanzas'},
    {location: 'Huelva', title: 'Asesor en Huelva', link: 'asesor en huelva', sector: 'Asesores'},
    {location: 'Huelva', title: 'Fontanero en Huelva', link: 'fontanero en huelva', sector: 'Fontaneros'},
    {location: 'Huelva', title: 'Servicio de limpieza en Huelva', link: 'servicio de limpieza en huelva', sector: 'Empresas de limpieza'},
    {location: 'Huelva', title: 'Electricista en Huelva', link: 'electricista en huelva', sector: 'Electricistas'},
    {location: 'Huelva', title: 'Clases particulares en Huelva', link: 'clases particulares en huelva', sector: 'Clases particulares'},
    {location: 'Huelva', title: 'Entrenador personal en Huelva', link: 'entrenador personal en huelva', sector: 'Entrenadores personales'},
    {location: 'Huelva', title: 'Traductor en Huelva', link: 'traductor en huelva', sector: 'Traductores'},
    {location: 'Huelva', title: 'Fotógrafo en Huelva', link: 'fotografo en huelva', sector: 'Fotógrafos'},
    {location: 'Huelva', title: 'Contable en Huelva', link: 'contable en huelva', sector: 'Contables'},
    {location: 'Huelva', title: 'Mudanza en Huelva', link: 'mudanza en huelva', sector: 'Mudanzas'},
    {location: 'Cádiz', title: 'Asesor en Cádiz', link: 'asesor en cadiz', sector: 'Asesores'},
    {location: 'Cádiz', title: 'Fontanero en Cádiz', link: 'fontanero en cadiz', sector: 'Fontaneros'},
    {location: 'Cádiz', title: 'Servicio de limpieza en Cádiz', link: 'servicio de limpieza en cadiz', sector: 'Empresas de limpieza'},
    {location: 'Cádiz', title: 'Electricista en Cádiz', link: 'electricista en cadiz', sector: 'Electricistas'},
    {location: 'Cádiz', title: 'Clases particulares en Cádiz', link: 'clases particulares en cadiz', sector: 'Clases particulares'},
    {location: 'Cádiz', title: 'Entrenador personal en Cádiz', link: 'entrenador personal en cadiz', sector: 'Entrenadores personales'},
    {location: 'Cádiz', title: 'Traductor en Cádiz', link: 'traductor en cadiz', sector: 'Traductores'},
    {location: 'Cádiz', title: 'Fotógrafo en Cádiz', link: 'fotografo en cadiz', sector: 'Fotógrafos'},
    {location: 'Cádiz', title: 'Contable en Cádiz', link: 'contable en cadiz', sector: 'Contables'},
    {location: 'Cádiz', title: 'Mudanza en Cádiz', link: 'mudanza en cadiz', sector: 'Mudanzas'},
    {location: 'Torremolinos', title: 'Asesor en Torremolinos', link: 'asesor en torremolinos', sector: 'Asesores'},
    {location: 'Torremolinos', title: 'Fontanero en Torremolinos', link: 'fontanero en torremolinos', sector: 'Fontaneros'},
    {
      location: 'Torremolinos',
      title: 'Servicio de limpieza en Torremolinos',
      link: 'servicio de limpieza en torremolinos',
      sector: 'Empresas de limpieza'
    },
    {location: 'Torremolinos', title: 'Electricista en Torremolinos', link: 'electricista en torremolinos', sector: 'Electricistas'},
    {
      location: 'Torremolinos',
      title: 'Clases particulares en Torremolinos',
      link: 'clases particulares en torremolinos',
      sector: 'Clases particulares'
    },
    {
      location: 'Torremolinos',
      title: 'Entrenador personal en Torremolinos',
      link: 'entrenador personal en torremolinos',
      sector: 'Entrenadores personales'
    },
    {location: 'Torremolinos', title: 'Traductor en Torremolinos', link: 'traductor en torremolinos', sector: 'Traductores'},
    {location: 'Torremolinos', title: 'Fotógrafo en Torremolinos', link: 'fotografo en torremolinos', sector: 'Fotógrafos'},
    {location: 'Torremolinos', title: 'Contable en Torremolinos', link: 'contable en torremolinos', sector: 'Contables'},
    {location: 'Torremolinos', title: 'Mudanza en Torremolinos', link: 'mudanza en torremolinos', sector: 'Mudanzas'},
    {location: 'Fuengirola', title: 'Asesor en Fuengirola', link: 'asesor en fuengirola', sector: 'Asesores'},
    {location: 'Fuengirola', title: 'Fontanero en Fuengirola', link: 'fontanero en fuengirola', sector: 'Fontaneros'},
    {
      location: 'Fuengirola',
      title: 'Servicio de limpieza en Fuengirola',
      link: 'servicio de limpieza en fuengirola',
      sector: 'Empresas de limpieza'
    },
    {location: 'Fuengirola', title: 'Electricista en Fuengirola', link: 'electricista en fuengirola', sector: 'Electricistas'},
    {
      location: 'Fuengirola',
      title: 'Clases particulares en Fuengirola',
      link: 'clases particulares en fuengirola',
      sector: 'Clases particulares'
    },
    {
      location: 'Fuengirola',
      title: 'Entrenador personal en Fuengirola',
      link: 'entrenador personal en fuengirola',
      sector: 'Entrenadores personales'
    },
    {location: 'Fuengirola', title: 'Traductor en Fuengirola', link: 'traductor en fuengirola', sector: 'Traductores'},
    {location: 'Fuengirola', title: 'Fotógrafo en Fuengirola', link: 'fotografo en fuengirola', sector: 'Fotógrafos'},
    {location: 'Fuengirola', title: 'Contable en Fuengirola', link: 'contable en fuengirola', sector: 'Contables'},
    {location: 'Fuengirola', title: 'Mudanza en Fuengirola', link: 'mudanza en fuengirola', sector: 'Mudanzas'},
    {location: 'Marbella', title: 'Asesor en Marbella', link: 'asesor en marbella', sector: 'Asesores'},
    {location: 'Marbella', title: 'Fontanero en Marbella', link: 'fontanero en marbella', sector: 'Fontaneros'},
    {
      location: 'Marbella',
      title: 'Servicio de limpieza en Marbella',
      link: 'servicio de limpieza en marbella',
      sector: 'Empresas de limpieza'
    },
    {location: 'Marbella', title: 'Electricista en Marbella', link: 'electricista en marbella', sector: 'Electricistas'},
    {
      location: 'Marbella',
      title: 'Clases particulares en Marbella',
      link: 'clases particulares en marbella',
      sector: 'Clases particulares'
    },
    {
      location: 'Marbella',
      title: 'Entrenador personal en Marbella',
      link: 'entrenador personal en marbella',
      sector: 'Entrenadores personales'
    },
    {location: 'Marbella', title: 'Traductor en Marbella', link: 'traductor en marbella', sector: 'Traductores'},
    {location: 'Marbella', title: 'Fotógrafo en Marbella', link: 'fotografo en marbella', sector: 'Fotógrafos'},
    {location: 'Marbella', title: 'Contable en Marbella', link: 'contable en marbella', sector: 'Contables'},
    {location: 'Marbella', title: 'Mudanza en Marbella', link: 'mudanza en marbella', sector: 'Mudanzas'},
    {location: 'Benalmádena', title: 'Asesor en Benalmádena', link: 'asesor en benalmadena', sector: 'Asesores'},
    {location: 'Benalmádena', title: 'Fontanero en Benalmádena', link: 'fontanero en benalmadena', sector: 'Fontaneros'},
    {
      location: 'Benalmádena',
      title: 'Servicio de limpieza en Benalmádena',
      link: 'servicio de limpieza en benalmadena',
      sector: 'Empresas de limpieza'
    },
    {location: 'Benalmádena', title: 'Electricista en Benalmádena', link: 'electricista en benalmadena', sector: 'Electricistas'},
    {
      location: 'Benalmádena',
      title: 'Clases particulares en Benalmádena',
      link: 'clases particulares en benalmadena',
      sector: 'Clases particulares'
    },
    {
      location: 'Benalmádena',
      title: 'Entrenador personal en Benalmádena',
      link: 'entrenador personal en benalmadena',
      sector: 'Entrenadores personales'
    },
    {location: 'Benalmádena', title: 'Traductor en Benalmádena', link: 'traductor en benalmadena', sector: 'Traductores'},
    {location: 'Benalmádena', title: 'Fotógrafo en Benalmádena', link: 'fotografo en benalmadena', sector: 'Fotógrafos'},
    {location: 'Benalmádena', title: 'Contable en Benalmádena', link: 'contable en benalmadena', sector: 'Contables'},
    {location: 'Benalmádena', title: 'Mudanza en Benalmádena', link: 'mudanza en benalmadena', sector: 'Mudanzas'},
  ];

  metaFilterLink = [
    {
      sector: 'Mudanzas',
      title: 'Empresas de Mudanzas Málaga en Febelink',
      h1: 'Empresas de Mudanzas Málaga',
      h2: null,
      description: 'Descubra la solución perfecta para su mudanza en Málaga con nuestra innovadora plataforma de anuncios de empresas de mudanzas. En nuestra página web, encontrará una amplia selección de servicios confiables y profesionales que le ayudarán a facilitar su traslado. Nuestro objetivo es proporcionar a nuestros usuarios una experiencia sencilla y eficiente a la hora de buscar empresas de mudanzas en Málaga. Con solo unos pocos clics, podrá acceder a una lista exhaustiva de empresas de renombre que se especializan en servicios de mudanzas locales e internacionales. Cada empresa de mudanzas en nuestra plataforma ha sido cuidadosamente seleccionada para garantizar la máxima calidad y satisfacción del cliente. Además, ofrecemos herramientas útiles que le permitirán obtener presupuestos personalizados de varias empresas de mudanzas en Málaga. Esto le ayudará a comparar precios y servicios para encontrar la opción más conveniente para usted.'
    },
    {
      sector: 'Asesores',
      title: 'Asesorías y Asesores Málaga en Febelink',
      h1: 'Asesorías y Asesores Málaga',
      h2: null,
      description: 'Descubra un mundo de servicios de asesoría confiables y profesionales en Málaga a través de nuestra página web de anuncios. Encontrar la asesoría adecuada para sus necesidades nunca ha sido tan fácil. Nuestra plataforma le ofrece una amplia variedad de especialidades, desde asesoría fiscal y contable hasta legal y financiera. Además, nuestra página web le permite solicitar presupuestos personalizados de varias asesorías en Málaga, lo que le ayudará a comparar precios y servicios para encontrar la opción más conveniente para usted. Confíe en profesionales expertos para asistirlo en aspectos clave de su negocio o vida personal. ¡Visite nuestra página web hoy mismo y descubra cómo podemos conectarlo con las mejores asesorías en Málaga para satisfacer sus necesidades de manera eficiente y segura!'
    },
    {
      sector: 'Fontaneros',
      title: 'Empresas de Fontaneros Málaga en Febelink',
      h1: 'Empresas de Fontaneros Málaga',
      h2: 'Las mejores empresas de fontanería en Málaga',
      description: 'Descubra una solución rápida y confiable para sus problemas de fontanería en Málaga a través de nuestra plataforma de anuncios de fontaneros. Nuestra página web le ofrece acceso a una amplia gama de fontaneros profesionales y calificados en la zona. Ya sea que necesite reparar una fuga de agua, desatascar tuberías o instalar nuevos accesorios, encontrará una selección de fontaneros confiables y expertos en nuestra plataforma. Cada fontanero ha sido cuidadosamente seleccionado para garantizar su experiencia y calidad de servicio. Además, ofrecemos herramientas para solicitar presupuestos personalizados de varios fontaneros en Málaga, lo que le permitirá comparar precios y servicios para encontrar la mejor opción para usted.'
    },
    {
      sector: 'Empresas de limpieza',
      title: 'Empresas de Limpieza Málaga en Febelink',
      h1: 'Empresas de Limpieza Málaga',
      h2: null,
      description: 'Descubra una forma fácil y eficiente de encontrar servicios de limpieza confiables en Málaga a través de nuestra plataforma de anuncios de empresas de limpieza. En nuestra página web, encontrará una amplia selección de empresas especializadas en servicios de limpieza para hogares, oficinas, locales comerciales y más. Trabajamos con empresas de limpieza profesionales y de confianza en Málaga, que han sido cuidadosamente seleccionadas para garantizar la calidad de sus servicios. Puede leer las reseñas y opiniones de otros usuarios para tomar una decisión informada y elegir la empresa de limpieza que mejor se adapte a sus necesidades y presupuesto. Además, nuestra plataforma le permite solicitar presupuestos personalizados de varias empresas de limpieza en Málaga, lo que le ayudará a comparar precios y servicios para encontrar la opción más conveniente para usted. Simplifique su vida y confíe en profesionales para que se encarguen de las tareas de limpieza.'
    },
    {
      sector: 'Electricistas',
      title: 'Electricistas Málaga en Febelink',
      h1: 'Electricistas Málaga',
      h2: null,
      description: 'Encuentre soluciones rápidas y confiables para sus necesidades eléctricas en Málaga a través de nuestra plataforma de anuncios de electricistas. En nuestra página web, le ofrecemos acceso a una amplia selección de electricistas profesionales y capacitados en la zona. Ya sea que necesite reparar una falla eléctrica, instalar iluminación o realizar trabajos de cableado, encontrará una variedad de electricistas confiables en nuestra plataforma. Cada electricista ha sido cuidadosamente verificado para garantizar su experiencia y habilidades en el campo. Además, brindamos la opción de solicitar presupuestos personalizados de varios electricistas en Málaga, lo que le permitirá comparar precios y servicios para encontrar la mejor opción para usted.'
    },
    {
      sector: 'Clases particulares',
      title: 'Profesores para Clases Particulares Málaga en Febelink',
      h1: 'Profesores para Clases Particulares Málaga',
      h2: 'Mejores profesores particulares de Málaga',
      description: 'Descubra una forma conveniente y eficaz de encontrar profesores para clases particulares en Málaga a través de nuestra plataforma de anuncios. En nuestra página web, encontrará una amplia selección de profesores capacitados y especializados en diversas materias y niveles educativos. Nuestro objetivo es proporcionar a nuestros usuarios acceso a profesores calificados y comprometidos que puedan brindar clases particulares personalizadas y adaptadas a las necesidades individuales de cada estudiante. Puede explorar perfiles de profesores, leer sus credenciales y experiencias para tomar una decisión informada y elegir el profesor adecuado.'
    },
    {
      sector: 'Entrenadores personales',
      title: 'Entrenadores Personales Málaga en Febelink',
      h1: 'Entrenadores Personales Málaga',
      h2: null,
      description: 'Descubra una manera efectiva y personalizada de alcanzar sus metas de fitness en Málaga a través de nuestra plataforma de anuncios de entrenadores personales. En nuestra página web, encontrará una amplia selección de entrenadores personales profesionales y cualificados en la zona. Nuestro objetivo es proporcionar a nuestros usuarios acceso a entrenadores personales expertos que los ayuden a alcanzar sus objetivos de acondicionamiento físico de manera segura y eficiente. Cada entrenador personal en nuestra plataforma ha sido cuidadosamente seleccionado para garantizar su experiencia y conocimientos en el campo. Puede explorar los perfiles de los entrenadores, conocer sus especialidades y leer las opiniones de otros clientes para tomar una decisión informada y elegir el entrenador personal que mejor se adapte a sus necesidades y preferencias.'
    },
    {
      sector: 'Traductores',
      title: 'Traductores Málaga en Febelink',
      h1: 'Traductores Málaga',
      h2: null,
      description: 'Descubra una solución confiable y eficiente para sus necesidades de traducción en Málaga a través de nuestra plataforma de anuncios de traductores. En nuestra página web, encontrará una amplia selección de traductores profesionales y experimentados en diferentes idiomas y campos especializados. Nuestro objetivo es brindar a nuestros usuarios acceso a traductores cualificados que puedan garantizar la precisión y la calidad en sus proyectos de traducción. Cada traductor en nuestra plataforma ha sido cuidadosamente evaluado para garantizar su competencia lingüística y su experiencia en la materia.'
    },
    {
      sector: 'Fotógrafos',
      title: 'Fotógrafos Málaga en Febelink',
      h1: 'Fotógrafos Málaga',
      h2: null,
      description: 'Descubra la belleza de Málaga a través de los ojos de talentosos fotógrafos en nuestra plataforma de anuncios. En nuestra página web, encontrará una amplia selección de fotógrafos profesionales que capturan la esencia y la magia de esta hermosa ciudad. Ya sea que necesite fotografías para una boda, un evento especial, retratos o simplemente desee capturar los encantadores paisajes de Málaga, tenemos fotógrafos expertos en diferentes estilos y géneros. Cada fotógrafo en nuestra plataforma ha sido cuidadosamente seleccionado para garantizar su habilidad y creatividad en la captura de momentos especiales. Puede explorar los portfolios de los fotógrafos, conocer su enfoque artístico y leer las opiniones de otros clientes para tomar una decisión informada y elegir el fotógrafo que mejor se ajuste a sus necesidades y preferencias.'
    },
    {
      sector: 'Contables',
      title: 'Contables Málaga en Febelink',
      h1: 'Contables Málaga',
      h2: null,
      description: 'Gracias a nuestra plataforma de anuncios de contables. En nuestra página web, encontrará una amplia selección de contables profesionales y calificados en diferentes áreas de la contabilidad. Nuestro objetivo es proporcionar a nuestros usuarios acceso a contables confiables y competentes que puedan brindar servicios contables de alta calidad. Cada contable en nuestra plataforma ha sido cuidadosamente seleccionado para garantizar su experiencia y conocimientos en el campo. Puede explorar los perfiles de los contables, conocer sus especialidades y leer las reseñas de otros clientes para tomar una decisión informada y seleccionar el contable que mejor se adapte a sus necesidades y requerimientos.'
    }];

  displayPartialSignUp: boolean = false;
  email: string;

  constructor(
    public searchService: SearchService,
    private router: Router,
    public authenticationService: AuthenticationService,
    private actRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private title: Title
  ) {
    this.type = 'resultado';
    this.services = this.services.sort((a, b) => 0.5 - Math.random());
    this.sectors = this.sectors.sort((a, b) => 0.5 - Math.random());

    this.locationFilter = sessionStorage.getItem('locationFilter');
    this.locationFilterLink = this.locationFilterLink.filter(link => link.location === this.locationFilter);
    this.metaLocationFilter = sessionStorage.getItem('metaLocationFilter');
    console.log(this.locationFilter, this.locationFilterLink, this.metaLocationFilter);

    /*this.actRouter.params.subscribe(val => {
      this.locationFilter = this.searchService.getLocationFilter();
      this.locationFilterLink = this.locationFilterLink.filter(link => link.location === this.locationFilter);
      console.log(this.locationFilter, this.locationFilterLink);
    });*/

    this.actRouter.params.subscribe(val => {
      // this.metaLocationFilter = this.searchService.getMetaLocationFilter();
      this.metaFilterLink.filter(item => {
        if (item.sector === this.metaLocationFilter) {
          this.title.setTitle(item.title);
          this.generalTitle.emit(item.h1);
          this.resultTitle = item.h2;
          this.metaDescription = item.description;
        }
      });
    });
  }

  ngAfterViewInit() {
    this.locationFilter = sessionStorage.getItem('locationFilter');
    this.locationFilterLink = this.locationFilterLink.filter(link => link.location === this.locationFilter);
    this.metaLocationFilter = sessionStorage.getItem('metaLocationFilter');
    console.log(this.locationFilter, this.locationFilterLink, this.metaLocationFilter);
    this.cdRef.detectChanges();

    this.locationFilter = this.searchService.getLocationFilter();
    this.metaLocationFilter = this.searchService.getMetaLocationFilter();
    this.metaFilterLink.filter(item => {
      if (item.sector === this.metaLocationFilter) {
        this.title.setTitle(item.title);
        this.generalTitle.emit(item.h1);
        this.resultTitle = item.h2;
        this.metaDescription = item.description;
      }
    });
    /*this.searchService.getLocationFilter().subscribe((locationState) => {
      this.locationFilter = locationState;
      console.log('locationFilter: ', this.locationFilter);
    });*/
    /*this.searchService.getData()
    .then(res => {
        this.data = res;
    }).catch(err => {
        console.log(err);
    }); */
  }

  segmentChanged(event) {
    console.log(event);
  }

  public irA(p: string): void {
    this.router.navigate([p]);
  }

  getR() {
    return this.searchService.getResult();
  }

  getOf() {
    return this.searchService.getOffers();
  }

  getL() {
    return this.searchService.getList();
  }

  text(text?: string): string {
    if (text != undefined) {
      this.searchText = text;
    }
    return this.searchText || '';
  }

  clear() {
    this.searchText = '';
  }

  async getRecommendations() {
    const {response} = await this.searchService.getRecommendations();
    if (response) {
      this.recommendations = response;

      // ToDo: Temporal SHUFFLE results
      let shuffledResults = this.recommendations?.specialOffer;
      var m = shuffledResults.length,
        t,
        i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = shuffledResults[m];
        shuffledResults[m] = shuffledResults[i];
        shuffledResults[i] = t;
      }

      this.recommendations.specialOffer = shuffledResults;
    }
  }

  async search() {
    const {response} = await this.searchService.getProfessionsByFilter(
      this.searchText
    );
    if (response) {
      const bestProfessionMatch: number[] = [];
      response.forEach((elem) => {
        bestProfessionMatch.push(elem.id);
      });
      if (bestProfessionMatch.length > 0 || this.searchText) {
        const {response} = await this.searchService.search(
          this.searchText,
          bestProfessionMatch
        );
        this.searchResponse = response;
      }
    }
  }

  async searchMoreResults() {
    let otherResultAmount = this.searchResponse?.otherResults?.length;

    if (otherResultAmount < 100 && this.searchText) {
      const {response} = await this.searchService.searchMoreResults(
        this.searchText,
        otherResultAmount + 1
      );
      this.searchResponse.otherResults =
        this.searchResponse.otherResults.concat(response);
    }
  }

  removeBlankSpace(term: string): string {
    return term.replace(new RegExp(' ', 'g'), '-');
  }

  async changeFilter(locationFilter: string, link: string) {
    await this.searchService.setLocationFilter(locationFilter);
    sessionStorage.setItem('locationFilter', locationFilter);
    // this.irA('/listado/' + link);
  }

  async changeMetaFilter(metaFilter: string, link: string) {
    await this.searchService.setMetaLocationFilter(metaFilter);
    sessionStorage.setItem('metaLocationFilter', metaFilter);
    // this.irA('/listado/' + link);
  }

  public trackItem(index: number, item: any) {
    return item.trackId;
  }
}
