import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IOptsMenuButton } from './models/opts-menu.model';

@Component({
  selector: 'app-opts-menu',
  templateUrl: './opts-menu.component.html',
  styleUrls: ['./opts-menu.component.scss'],
})
export class OptsMenuComponent implements OnInit {

  @Input() buttons: IOptsMenuButton[] | undefined
  @Input() title: string = ""

  constructor(
    private popCtrl: PopoverController
  ) { }

  ngOnInit() {}

  OnClick( btn: IOptsMenuButton )
  {
    if( !btn?.preventDismissOnClick )
      this.popCtrl.dismiss()
    
    btn?.click( btn )
  }
}
