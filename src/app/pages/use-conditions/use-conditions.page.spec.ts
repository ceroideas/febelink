import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UseConditionsPage } from './use-conditions.page';

describe('UseConditionsPage', () => {
  let component: UseConditionsPage;
  let fixture: ComponentFixture<UseConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseConditionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UseConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
