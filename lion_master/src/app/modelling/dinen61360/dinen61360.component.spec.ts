import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dinen61360Component } from './dinen61360.component';

describe('Dinen61360Component', () => {
  let component: Dinen61360Component;
  let fixture: ComponentFixture<Dinen61360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dinen61360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dinen61360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
