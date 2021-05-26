import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoBarComponent } from './grafico-bar.component';

describe('GraficoBarComponent', () => {
  let component: GraficoBarComponent;
  let fixture: ComponentFixture<GraficoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficoBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
