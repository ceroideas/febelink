import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GoBuyTokensComponent } from './go-buy-tokens.component';

describe('GoBuyTokensComponent', () => {
  let component: GoBuyTokensComponent;
  let fixture: ComponentFixture<GoBuyTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoBuyTokensComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GoBuyTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
