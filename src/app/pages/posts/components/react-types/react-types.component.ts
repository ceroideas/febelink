import { Component, OnInit, ViewEncapsulation, Output, EventEmitter  } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IReactTypes, Reacts } from '../models/react-types.model';

@Component({
  selector: 'app-react-types-component',
  templateUrl: './react-types.component.html',
  styleUrls: ['./react-types.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReactTypesComponent implements OnInit
{
  @Output() OnReacted: EventEmitter<IReactTypes> = new EventEmitter();
  
  reactTypes: IReactTypes[] = Reacts.list()
  reacts = Reacts

  constructor(
    public popCtrl: PopoverController
  ) {}

  ngOnInit() {}

  reacted( reactType: IReactTypes )
  {
    if( this.OnReacted ) this.OnReacted.emit( reactType )
    this.popCtrl.dismiss( reactType )
  }
}
