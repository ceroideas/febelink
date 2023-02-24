import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() currentUser;

  constructor(private router: Router,) {
  }

  perfil;
  homePage;
  onImgError;

  irA(value) {
    this.router.navigate([value]);
  };
}
