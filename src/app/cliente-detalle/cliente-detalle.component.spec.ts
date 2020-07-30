import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteDetalleComponent } from './cliente-detalle.component';

describe('ClienteDetalleComponent', () => {
  let component: ClienteDetalleComponent;
  let fixture: ComponentFixture<ClienteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
