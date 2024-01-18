import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() currentUser;

  constructor(private router: Router,  private location: Location) {
  }

  perfil;
  homePage;
  onImgError;

  irA(value) {
    window.location.href = value;
    // this.router.navigate([value]);
  };
}
