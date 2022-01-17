import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingBLComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() message: string = 'common.searching';

  constructor() { }

  ngOnInit() {}

}
