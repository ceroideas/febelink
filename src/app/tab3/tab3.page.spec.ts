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
import { IOffer } from '../models/offer.model';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;
  let el: DebugElement;

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
          useValue: null
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
    el = fixture.debugElement;
    
    component.offers = [
      {
        demanda: "",
        descripcion: "",
        estado: 0,
        estado_oferta: "",
        id: 0,
        id_demanda: 0,
        id_ofertante: 0,
        nombre: "",
        precio: 0,
        respondida: 0,
        type: "",
        created_at: "",
        updated_at: "",
        id_demandante: 1
      }
    ] as any as IOffer[];  
    component.currentUser = {
      id: 1,
      role_id: 0,
      nick: "",
      name: "",
      email: "",
      avatar: "",
      email_verified_at: "",
      provider: "",
      settings: "",
      created_at: "",
      updated_at: "",
      descripcion: "",
      
      direccion: "",
      direccion_resto: "",
      province_id: 0,
      town_id: 0,
      country: "",
      state: "",
      department: "",
      locality: "",
      place_id: "",

      telefono: "",
      logo: "",
      dni: "",
      doc_type: "",
      kyc_verified_at: "",
      card_brand: "",
      card_last_four: "",
      trial_ends_at: "",
      stripe_id: 0,
      skip_wizard: 0,
      reference: "",
      google_id: "",
      facebook_id: "",
      suspended: 0,
    }

    fixture.detectChanges();
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
