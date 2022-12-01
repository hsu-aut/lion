import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericOdpComponent } from './generic-odp.component';

describe('GenericOdpComponent', () => {
  let component: GenericOdpComponent;
  let fixture: ComponentFixture<GenericOdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericOdpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericOdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
