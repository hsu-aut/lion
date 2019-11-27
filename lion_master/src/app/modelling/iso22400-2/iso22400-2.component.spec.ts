/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Iso22400_2Component } from './iso22400-2.component';

describe('Iso22400-2Component', () => {
  let component: Iso22400_2Component;
  let fixture: ComponentFixture<Iso22400_2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Iso22400_2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Iso22400_2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
