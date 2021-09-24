import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

export interface Scraping {
  u: string;            // url
  t: string;            // title
  d: string;            // description
  i: string;            // image
}

@Component({
  selector: 'app-link-preview',
  templateUrl: './link-preview.component.html',
  styleUrls: ['./link-preview.component.scss'],
})

/**
 *  Componente creado para extraer información básica de las Urls que se le pasen
 * */
export class LinkPreviewComponent implements OnInit {

  private title: string = 'Título';
  private description: string = 'Descripción';
  private image: string = 'https://tecnotril.com/wp-content/uploads/2019/04/placeholder-image.png';

  @Input() url: string = "https://febelink.com"; // Pagina ejemplo base
  @Input() urls: Array<Scraping> = [{
    u: "https://febelink.com",
    t: this.title,
    d: this.description,
    i: this.image
  }];
  @Input() columns: number = 4;
  @Input() target: string = '_blank';

  /** Alternative API for Scrapping
  private api: string = "http://api.linkpreview.net/?";
  private keys: Array<string> = [
    "5cd32a757565b4e17f2a258effb8ae350f8a8062d9a4c",
    "5d04a893457c8c32e57398a4a3d95cb29ce12ae30e18f",
    "5e24c8a55774042ec8f73f8d06c8cbe768098a3103ab3",
    "5b54e80a65c77848ceaa4630331e8384950e09d392365",
  ]
  private param_url: string = 'q';
  */
  private api: string = "http://api.embed.ly/1/oembed?";
  private keys: Array<string> = [
    "08b652e6b3ea11e0ae3f4040d3dc5c07",
  ]
  private key_i: number = 0;
  private key: string = this.keys[ this.key_i ];
  private param_url: string = 'url';
  
  private obs: Array<Observable<Object>> = [];
  private next: ( value: any ) => void;
  private error: ( error: any ) => void;
  private complete: () => void;

  constructor( private http: HttpClient ) { }

  ngOnInit() {
    this.exec();
  }

  setUrl( urls: string | Array<Scraping> ): LinkPreviewComponent {
    // Puede setear de a una o de a Arrays
    this.urls = typeof urls !== 'string' ? urls :
        [{ u: urls, t: this.title, d: this.description, i: this.image }];
    return this;
  }
  OnResponse( next?: ( value: any ) => void): LinkPreviewComponent { // Response Callback
    if( !next )
      this.next = next;

    return this;
  }
  OnError( error?: (error: any) => void ): LinkPreviewComponent { // Error Callback
    if( !error )
      this.error = error;

    return this;
  }
  OnComplete( complete?: () => void ): LinkPreviewComponent { // Complete Callback
    if( !complete )
      this.complete = complete;

    return this;
  }
  exec( next?: ( value: any ) => void, error?: (error: any) => void, complete?: () => void ) :LinkPreviewComponent {
    this.OnResponse( next );
    this.OnError( error );
    this.OnComplete( complete );

    /**
     * Hago un bucle por cada url para ir a consultar en paralelo
     * */
    this.urls.forEach( scraping => {
      if( !scraping.t )
        scraping.t = this.title;
      if( !scraping.d )
        scraping.d = this.description;
      if( !scraping.i )
        scraping.i = this.image;
        
      // Almaceno los observables dentro de esta variable
      this.obs.push( this.http.get( this.fullUrl( scraping )));
    });
    
    // Ejecuto el Scraping de las Urls anteriormente listadas
    this.run();

    return this;
  }

  private fullUrl( url: Scraping ): string {
    // Aquí concateno para utilizar esta API ya creada para hacer el Scraping
    return this.api + 'key=' + this.key + '&' + this.param_url + '=' + url.u;
  }

  private run(): LinkPreviewComponent {
    // Añado los Observables y los suscribo
    forkJoin( this.obs ).subscribe(
      ( results) => {
        // Los resultados vienen ordenados segun el array de this.obs
        // que a su vez tiene el mismo orden que this.urls
        for( let i: number = 0; i < results.length; i++ ) {
          let data = results[ i ];

          // seteo su info para que lo actualice en .html
          this.urls[ i ].t = data[ 'title' ] ? data[ 'title' ] : this.title;
          this.urls[ i ].d = data[ 'description' ] ? data[ 'description' ] : this.description;
          this.urls[ i ].i = data[ 'thumbnail_url' ] ? data[ 'thumbnail_url' ] : this.image;
          // this.urls[ i ].i = data[ 'image' ] ? data[ 'image' ] : this.image;

          // En caso de tener callback lo llamo para decirle que terminé con esta info
          if( this.next )
            this.next( data );
        }
      },
      ( err ) => {
        if( err[ 'status' ] === 429 ) { // Limit exceeded
          // Get next key for scraping
          this.key_i++;
          if( this.key_i < this.keys.length ) {
            this.key = this.keys[ this.key_i ];

            this.exec();
          }
        }

        // En caso de tener callback lo llamo para decirle que tuve error
        if( this.error )
          this.error( err );
      },
      () => {
        // En caso de tener callback lo llamo para decirle que terminé
        if( this.complete )
          this.complete();
      });

    return this;
  }

  // Lo agrego para que cuando lo clickeen abra en el target indicado ( e.g.: new tab )
  goTo( url: string ) {
    window.open( url , this.target );
  }
}
