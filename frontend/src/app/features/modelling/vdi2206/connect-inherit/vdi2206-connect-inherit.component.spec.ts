/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Vdi2206ConnectInheritComponent } from './vdi2206-connect-inherit.component';

describe('Vdi2206ConnectInheritComponent', () => {
  let component: Vdi2206ConnectInheritComponent;
  let fixture: ComponentFixture<Vdi2206ConnectInheritComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vdi2206ConnectInheritComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vdi2206ConnectInheritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
