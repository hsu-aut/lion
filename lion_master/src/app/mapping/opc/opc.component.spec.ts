/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpcComponent } from './opc.component';

describe('OpcComponent', () => {
  let component: OpcComponent;
  let fixture: ComponentFixture<OpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
