import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuyTokensComponent } from './buy-tokens.component';

describe('BuyTokensComponent', () => {
  let component: BuyTokensComponent;
  let fixture: ComponentFixture<BuyTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyTokensComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuyTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
