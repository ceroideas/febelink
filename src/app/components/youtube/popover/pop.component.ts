import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-youtube-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss'],
})
export class YouTubePopComponent implements OnInit {

  @Input() url: string = '3XeE6fOsGiE';
  @Input() autoplay: boolean = true;
  @Input() rel: number = 0;

  trustedVideoUrl: SafeResourceUrl;

  constructor(
      private popoverController: PopoverController
    , public navCtrl: NavController
    , private domSanitizer: DomSanitizer ) { }

  ngOnInit() {
    let video: string = 'https://www.youtube.com/embed/'
        + this.url
        + '?' + 'rel=' + this.rel
        + '&' + 'autoplay=' + ( this.autoplay ? 1 : 0 );
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl( video );
    console.log( 'this.video', video );
    console.log( 'this.trustedVideoUrl', this.trustedVideoUrl );
  }

  onDismiss( ) {
    this.popoverController.dismiss({ })
  } 
}
