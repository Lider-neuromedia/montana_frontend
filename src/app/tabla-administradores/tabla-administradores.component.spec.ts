import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAdministradoresComponent } from './tabla-administradores.component';

describe('TablaAdministradoresComponent', () => {
  let component: TablaAdministradoresComponent;
  let fixture: ComponentFixture<TablaAdministradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaAdministradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
