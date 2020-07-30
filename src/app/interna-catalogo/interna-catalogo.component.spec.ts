import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternaCatalogoComponent } from './interna-catalogo.component';

describe('InternaCatalogoComponent', () => {
  let component: InternaCatalogoComponent;
  let fixture: ComponentFixture<InternaCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternaCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternaCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
