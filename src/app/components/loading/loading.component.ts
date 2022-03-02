import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingBLComponent implements OnInit {

  @Input() isLoading: boolean = true;
  @Input() message: string = 'common.searching';
  @Input() clase: string;

  constructor() { }

  ngOnInit() {}

}
