import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.page.html',
  styleUrls: ['./success.page.scss'],
})
export class SuccessPage {

  constructor(
    private router: Router,
  ) { }

  back(){
    this.router.navigate(['token'])
  }
}
