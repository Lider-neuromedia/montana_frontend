import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExportPedidoComponent } from './dialog-export-pedido.component';

describe('DialogExportPedidoComponent', () => {
  let component: DialogExportPedidoComponent;
  let fixture: ComponentFixture<DialogExportPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExportPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExportPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
