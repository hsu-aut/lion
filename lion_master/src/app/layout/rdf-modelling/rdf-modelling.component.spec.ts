import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RdfModellingComponent } from './rdf-modelling.component';

describe('RdfModellingComponent', () => {
  let component: RdfModellingComponent;
  let fixture: ComponentFixture<RdfModellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RdfModellingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdfModellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
