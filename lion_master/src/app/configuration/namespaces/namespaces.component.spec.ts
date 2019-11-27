/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NamespacesComponent } from './namespaces.component';

describe('NamespacesComponent', () => {
  let component: NamespacesComponent;
  let fixture: ComponentFixture<NamespacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NamespacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
