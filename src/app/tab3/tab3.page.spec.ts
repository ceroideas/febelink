import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Tab3Page } from './tab3.page';
import { FilterPipe } from '../pipes/filter.pipe';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let el: DebugElement;

  const modalSpy = jasmine.createSpyObj('Modal', ['present']);
  const modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
  modalCtrlSpy.create.and.callFake(function () {
      return modalSpy;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Tab3Page
        , FilterPipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [        
        {
          provide: ModalController,
          useValue: modalCtrlSpy
        },
      ],
      imports: [
        TranslateModule.forRoot()
        , HttpClientModule
        , IonicStorageModule.forRoot()        
        , RouterTestingModule.withRoutes([])
      ], 
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Search bar is created', () => {
    const editBtn: DebugElement = el.query(By.css('#searchChat'));
    expect(editBtn).toBeTruthy();
  });

  it('Edit button is created', () => {
    const editBtn: DebugElement = el.query(By.css('.editBtn'));
    expect(editBtn).toBeTruthy();
  });
});
