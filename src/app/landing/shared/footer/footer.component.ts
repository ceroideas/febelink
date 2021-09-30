import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ILang, ILangDEFAULTS } from 'src/app/models/langs.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
/**
 * Footer component
 */
export class FooterComponent implements OnInit {

  year = new Date().getFullYear();
  @Input() lang: string = ILangDEFAULTS.spSP.lang;

  constructor( private router: Router ) { }

  ngOnInit(): void {
  }


  public navegar(ruta: string){
    this.router.navigate([ruta]);
  }

  async openPrivacyPolicy() {
    this.navegar('privacy-policy');
  }

  async openUseConditions() {
    this.navegar('use-conditions');
  }

}
