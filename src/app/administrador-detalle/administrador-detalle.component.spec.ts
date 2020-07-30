import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradorDetalleComponent } from './administrador-detalle.component';

describe('AdministradorDetalleComponent', () => {
  let component: AdministradorDetalleComponent;
  let fixture: ComponentFixture<AdministradorDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradorDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
