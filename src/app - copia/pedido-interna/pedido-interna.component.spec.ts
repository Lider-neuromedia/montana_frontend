import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoInternaComponent } from './pedido-interna.component';

describe('PedidoInternaComponent', () => {
  let component: PedidoInternaComponent;
  let fixture: ComponentFixture<PedidoInternaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoInternaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
