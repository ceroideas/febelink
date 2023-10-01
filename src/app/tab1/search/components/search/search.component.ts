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
    {title: 'Podólogos', link: 'podólogos-en', imageURL: 'assets/imgs/home/sector-health.jpeg'},
    {title: 'Mecánicos', link: 'taller-mecánico-en', imageURL: 'assets/imgs/home/sector-car.jpeg'},
    {title: 'Desarrolladores', link: 'empresa-de-programacion-y-desarrollo-en', imageURL: 'assets/imgs/home/sector-technology.jpeg'},
    {title: 'Diseñador gráfico', link: 'empresa-de-diseño-grafico-en', imageURL: 'assets/imgs/home/sector-technology.jpeg'},
    {title: 'Pintores', link: 'empresa-de-pintores-en', imageURL: 'assets/imgs/home/sector-plumber.jpeg'},
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
  ];

  locationFilterLink = [
    {title: 'Asesor en Málaga', link: 'asesor-en-malaga', sector: 'Asesores'},
    {title: 'Fontanero en Málaga', link: 'fontanero-en-malaga', sector: 'Fontaneros'},
    {title: 'Servicio de limpieza en Málaga', link: 'servicio-de-limpieza-en-malaga', sector: 'Empresas de limpieza'},
    {title: 'Electricista en Málaga', link: 'electricista-en-malaga', sector: 'Electricistas'},
    {title: 'Clases particulares en Málaga', link: 'clases-particulares-en-malaga', sector: 'Clases particulares'},
    {title: 'Entrenador personal en Málaga', link: 'entrenador-personal-en-malaga', sector: 'Entrenadores personales'},
    {title: 'Traductor en Málaga', link: 'traductor-en-malaga', sector: 'Traductores'},
    {title: 'Fotógrafo en Málaga', link: 'fotografo-en-malaga', sector: 'Fotógrafos'},
    {title: 'Contable en Málaga', link: 'contable-en-malaga', sector: 'Contables'},
    {title: 'Mudanza en Málaga', link: 'mudanza-en-malaga', sector: 'Mudanzas'},
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

    this.actRouter.params.subscribe(val => {
      this.locationFilter = this.searchService.getLocationFilter();
    });

    this.actRouter.params.subscribe(val => {
      this.metaLocationFilter = this.searchService.getMetaLocationFilter();
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
    // this.irA('/listado/' + link);
  }

  async changeMetaFilter(metaFilter: string, link: string) {
    await this.searchService.setMetaLocationFilter(metaFilter);
    // this.irA('/listado/' + link);
  }
}
