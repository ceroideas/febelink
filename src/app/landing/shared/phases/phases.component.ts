import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
})
export class PhasesComponent implements OnInit {

  constructor( private translateService: TranslateConfigService ) { }

  ngOnInit() {}

}
