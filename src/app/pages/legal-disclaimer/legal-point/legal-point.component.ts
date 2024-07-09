import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-legal-point',
  templateUrl: './legal-point.component.html',
})
export class LegalPointComponent implements OnInit {

  @Input() item: any;
  @Input() addBreak: boolean = false;

  constructor() { }

  ngOnInit() { }

}
