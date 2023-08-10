/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Vdi2206ConnectContainComponent } from './vdi2206-connect-contain.component';

describe('Vdi2206ConnectContainComponent', () => {
  let component: Vdi2206ConnectContainComponent;
  let fixture: ComponentFixture<Vdi2206ConnectContainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vdi2206ConnectContainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vdi2206ConnectContainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
