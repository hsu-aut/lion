/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FpbStepComponent } from './fpb-step.component';

describe('FpbStepComponent', () => {
  let component: FpbStepComponent;
  let fixture: ComponentFixture<FpbStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpbStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpbStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
