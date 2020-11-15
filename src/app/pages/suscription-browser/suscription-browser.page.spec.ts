import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuscriptionBrowserPage } from './suscription-browser.page';

describe('SuscriptionBrowserPage', () => {
  let component: SuscriptionBrowserPage;
  let fixture: ComponentFixture<SuscriptionBrowserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuscriptionBrowserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuscriptionBrowserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
