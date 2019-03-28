import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VDI3682Component } from './vdi3682.component';

describe('Semanz40Component', () => {
  let component: VDI3682Component;
  let fixture: ComponentFixture<VDI3682Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VDI3682Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VDI3682Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
