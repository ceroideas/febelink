import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyTokensPage } from './buy-tokens.page';

describe('BuyTokensPage', () => {
  let component: BuyTokensPage;
  let fixture: ComponentFixture<BuyTokensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTokensPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyTokensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
