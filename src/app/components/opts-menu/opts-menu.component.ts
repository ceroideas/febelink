import { Component, Input, OnInit } from '@angular/core';
import { IOptsMenuButton } from './models/opts-menu.model';

@Component({
  selector: 'app-opts-menu',
  templateUrl: './opts-menu.component.html',
  styleUrls: ['./opts-menu.component.scss'],
})
export class OptsMenuComponent implements OnInit {

  @Input() buttons: IOptsMenuButton[]
  @Input() title: string

  constructor() { }

  ngOnInit() {}

}
