import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-share-popover',
  templateUrl: './share-popover.component.html',
  styleUrls: ['./share-popover.component.scss'],
})
export class SharePopoverComponent implements OnInit {

  public url: string;
  public title: string;
  public desc: string;

  constructor( public navParams:NavParams ) {

    this.url = this.navParams.get('url');
    this.title = this.navParams.get('title');
    this.desc = this.navParams.get('desc');

    console.log("TIITLE",this.title);
    console.log("DESC",this.desc);
    console.log("URL",this.url);

   }

  ngOnInit() {}

  shareFB() {
    window.open("https://www.facebook.com/sharer/sharer.php?u="+this.url);
  }

  shareTwitter() {
    window.open("https://twitter.com/intent/tweet?text="+this.url);
  }

  shareLinkedin() {
    window.open("https://linkedin.com/shareArticle?mini=true&url="+this.url+"&title="+this.title+"&summary="+this.desc);
  }

}
