/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { R2rmlComponent } from './r2rml.component';

describe('R2rmlComponent', () => {
  let component: R2rmlComponent;
  let fixture: ComponentFixture<R2rmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ R2rmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(R2rmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
