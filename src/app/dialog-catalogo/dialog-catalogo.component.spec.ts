import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCatalogoComponent } from './dialog-catalogo.component';

describe('DialogCatalogoComponent', () => {
  let component: DialogCatalogoComponent;
  let fixture: ComponentFixture<DialogCatalogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCatalogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
