import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPreguntasPedidoComponent } from './dialog-preguntas-pedido.component';

describe('DialogPreguntasPedidoComponent', () => {
  let component: DialogPreguntasPedidoComponent;
  let fixture: ComponentFixture<DialogPreguntasPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPreguntasPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPreguntasPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
