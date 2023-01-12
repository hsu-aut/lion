/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewVdi3682IndividualComponent } from './new-vdi3682-individual.component';

describe('NewVdi3682IndividualComponent', () => {
  let component: NewVdi3682IndividualComponent;
  let fixture: ComponentFixture<NewVdi3682IndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVdi3682IndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVdi3682IndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
