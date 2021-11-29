import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TokensUsersPage } from './tokens-users.page';

describe('TokensUsersPage', () => {
  let component: TokensUsersPage;
  let fixture: ComponentFixture<TokensUsersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokensUsersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TokensUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
