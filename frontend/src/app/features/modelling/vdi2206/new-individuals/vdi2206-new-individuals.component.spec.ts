/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Vdi2206NewIndividualsComponent } from './vdi2206-new-individuals.component';

describe('Vdi2206NewIndividualsComponent', () => {
  let component: Vdi2206NewIndividualsComponent;
  let fixture: ComponentFixture<Vdi2206NewIndividualsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vdi2206NewIndividualsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Vdi2206NewIndividualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
