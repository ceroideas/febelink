import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss'],
})
export class SocialLinksComponent implements OnInit {
  // Las RRSS con sus links por default
  private _telegram: string = 'https://t.me/febelink';
  private _twitter: string = 'https://twitter.com/febelink?lang=es';
  private _facebook: string = 'https://www.facebook.com/febelink/';
  private _instagram: string = 'https://www.instagram.com/febelink/?hl=es';
  private _youtube: string =
    'https://www.youtube.com/channel/UCbfnUZt6hjYLab_OO9U385A';
  private _tiktok: string = 'https://www.tiktok.com/@febelink?';
  private _linkedin: string = 'https://es.linkedin.com/company/febelink';
  private _mail: string = 'mailto:token@febelink.com';

  nothingSet: boolean;

  // Si necesita modificarlas           Si solo quiere mostrar alguna en particular
  @Input() telegram: string;
  @Input() show_telegram: boolean = false;
  @Input() twitter: string;
  @Input() show_twitter: boolean = false;
  @Input() facebook: string;
  @Input() show_facebook: boolean = false;
  @Input() instagram: string;
  @Input() show_instagram: boolean = false;
  @Input() youtube: string;
  @Input() show_youtube: boolean = false;
  @Input() tiktok: string;
  @Input() show_tiktok: boolean = false;
  @Input() linkedin: string;
  @Input() show_linkedin: boolean = false;
  @Input() mail: string;
  @Input() show_mail: boolean = false;

  @Input() target: string = '_blank';

  constructor() {}

  ngOnInit() {
    this.checkNothingSet();
    this.setVars();
  }

  private checkNothingSet() {
    // !this.rrss             = no ha seteado un valor a esta variable
    // !this.show_rrss        = no ha indicado que quiere mostrar la RRSS

    this.nothingSet =
      !this.telegram &&
      !this.show_telegram &&
      !this.twitter &&
      !this.show_twitter &&
      !this.facebook &&
      !this.show_facebook &&
      !this.instagram &&
      !this.show_instagram &&
      !this.youtube &&
      !this.show_youtube &&
      !this.tiktok &&
      !this.show_tiktok &&
      !this.linkedin &&
      !this.show_linkedin &&
      !this.mail &&
      !this.show_mail;

    // this.nothingSet        = no ha seteado nada, mostrar las por default
  }

  // Aquí checkeo por cada RRSS para asignarle el valor que corresponda, a lo sumo quedará vacía
  // Luego en el HTML solo checkeo si this.RRSS tiene datos, en base a eso SHOW | HIDE
  private setVars() {
    this.telegram =
      this.nothingSet || this.show_telegram ? this._telegram : this.telegram;
    this.twitter =
      this.nothingSet || this.show_twitter ? this._twitter : this.twitter;
    this.facebook =
      this.nothingSet || this.show_facebook ? this._facebook : this.facebook;
    this.instagram =
      this.nothingSet || this.show_instagram ? this._instagram : this.instagram;
    this.youtube =
      this.nothingSet || this.show_youtube ? this._youtube : this.youtube;
    this.tiktok =
      this.nothingSet || this.show_tiktok ? this._tiktok : this.tiktok;

    // Como a mail solo lo solicitaron en el footer, entonces le dejo solo
    // con la condicion de que cuando se indique show_mail tome de this._mail
    // o en su defecto que indique el valor que contenga el Input() this.mail (por default = '' )
    this.mail = /* this.nothingSet || */ this.show_mail
      ? this._mail
      : this.mail;

    // Idem que mail
    this.linkedin = /* this.nothingSet || */ this.show_linkedin
      ? this._linkedin
      : this.linkedin;
  }
}
