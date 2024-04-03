import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ClicksPage} from './clicks.page';

describe('TokensUsersPage', () => {
  let component: ClicksPage;
  let fixture: ComponentFixture<ClicksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClicksPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClicksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
