import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministradoresBuscadorComponent } from './administradores-buscador.component';

describe('AdministradoresBuscadorComponent', () => {
  let component: AdministradoresBuscadorComponent;
  let fixture: ComponentFixture<AdministradoresBuscadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministradoresBuscadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradoresBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
