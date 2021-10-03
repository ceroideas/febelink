import { Component, OnInit } from '@angular/core';
import { TranslateConfigService } from 'src/app/services/translate/translate-config.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
/**
 * Features component
 */
export class FeaturesComponent implements OnInit {

  constructor( private translateService: TranslateConfigService ) { }

  ngOnInit(): void {
  }

}
