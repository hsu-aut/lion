import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ISO22400Component } from './iso22400.component';

describe('ISO22400Component', () => {
  let component: ISO22400Component;
  let fixture: ComponentFixture<ISO22400Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ISO22400Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ISO22400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
