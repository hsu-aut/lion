/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Vdi2206Component } from './vdi2206.component';

describe('Vdi2206Component', () => {
  let component: Vdi2206Component;
  let fixture: ComponentFixture<Vdi2206Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vdi2206Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vdi2206Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
