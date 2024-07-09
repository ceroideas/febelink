import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditTokensComponent } from './edit-tokens.component';

describe('EditTokensComponent', () => {
  let component: EditTokensComponent;
  let fixture: ComponentFixture<EditTokensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTokensComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
