import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
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
  public image: string;

  constructor( public navParams:NavParams, private metaService: Meta ) {

    this.url = this.navParams.get('url');
    this.title = this.navParams.get('title');
    this.desc = this.navParams.get('desc');
    this.image = this.navParams.get('image') || 'https://febelink.com/about/febelinkweb/images/home/principal.png';

    console.log("TIITLE",this.title);
    console.log("DESC",this.desc);
    console.log("URL",this.url);

    this.setFacebookTags(this.url, this.title, this.desc, this.image);

   }
   
   public setFacebookTags(url: string, title: string, description: string, image: string): void {
    var tags = [
      new MetaTag("og:url", url),
      new MetaTag("og:title", title),
      new MetaTag("og:description", description),
      new MetaTag("og:image", image),
      new MetaTag("og:image:secure_url", image)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
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

class MetaTag {
  name: string;
  value: string;

  constructor(name: string, value: string) {
      this.name = name;
      this.value = value;
  }
}