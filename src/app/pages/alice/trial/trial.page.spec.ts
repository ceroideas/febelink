import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrialPage } from './trial.page';

describe('TrialPage', () => {
  let component: TrialPage;
  let fixture: ComponentFixture<TrialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TrialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
