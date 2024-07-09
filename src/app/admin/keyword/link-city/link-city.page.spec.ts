import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {LinkCityPage} from './link-city.page';

describe('TokensUsersPage', () => {
  let component: LinkCityPage;
  let fixture: ComponentFixture<LinkCityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkCityPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkCityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
