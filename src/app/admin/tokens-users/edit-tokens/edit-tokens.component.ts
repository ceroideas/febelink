import { Component, Input, OnInit } from '@angular/core';
import { TokensUser } from '../../models/tokens-user';

@Component({
  selector: 'app-edit-tokens',
  templateUrl: './edit-tokens.component.html',
  styleUrls: ['./edit-tokens.component.scss'],
})
export class EditTokensComponent implements OnInit {

  constructor() { }

  @Input() tokensUser:TokensUser
  
  ngOnInit() {
    console.log(this.tokensUser);
    
  }
}
