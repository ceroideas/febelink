import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-num-float',
  templateUrl: './num-float.component.html',
  styleUrls: ['./num-float.component.scss'],
})
export class NumFloatComponent implements OnInit {

  @Input() number: number = 0; // Provide a default value
  @Input() round: number = 2;
  @Input() bold: boolean = false;
  @Input() color: string = 'black';
  @Input() classNbr: string = 'bold-6';
  @Input() classFloat: string = 'bold-6';

  constructor() { }

  ngOnInit() {}

}
