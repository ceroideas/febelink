import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {LinkLocationPage} from './link-location.page';

describe('TokensUsersPage', () => {
  let component: LinkLocationPage;
  let fixture: ComponentFixture<LinkLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkLocationPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
