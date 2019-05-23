/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WadlComponent } from './wadl.component';

describe('WadlComponent', () => {
  let component: WadlComponent;
  let fixture: ComponentFixture<WadlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WadlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WadlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
