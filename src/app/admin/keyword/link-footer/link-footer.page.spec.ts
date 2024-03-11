import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {LinkFooterPage} from './link-footer.page';

describe('TokensUsersPage', () => {
  let component: LinkFooterPage;
  let fixture: ComponentFixture<LinkFooterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkFooterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkFooterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
