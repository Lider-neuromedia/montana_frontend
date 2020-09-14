import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerRigthComponent } from './drawer-rigth.component';

describe('DrawerRigthComponent', () => {
  let component: DrawerRigthComponent;
  let fixture: ComponentFixture<DrawerRigthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerRigthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerRigthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
