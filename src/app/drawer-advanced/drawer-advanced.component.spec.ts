import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerAdvancedComponent } from './drawer-advanced.component';

describe('DrawerAdvancedComponent', () => {
  let component: DrawerAdvancedComponent;
  let fixture: ComponentFixture<DrawerAdvancedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerAdvancedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
