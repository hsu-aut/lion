import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Isa88Component } from './isa88.component';

describe('Isa88Component', () => {
  let component: Isa88Component;
  let fixture: ComponentFixture<Isa88Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Isa88Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Isa88Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
