import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import {addIcons} from 'ionicons';
import {add} from 'ionicons/icons';
@Component({
  selector: 'app-use-conditions',
  templateUrl: './use-conditions.page.html',
  styleUrls: ['./use-conditions.page.scss'],
})
export class UseConditionsPage implements OnInit {

  constructor(private location: Location,  private router: Router) {
    addIcons({add});
  }

  ngOnInit() {
  }

  /**
   * Close modal
   */
   public goBack(): void {
    this.location.back();
  }

  async openPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  

}
