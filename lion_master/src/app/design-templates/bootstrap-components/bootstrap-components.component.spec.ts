import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapComponentsComponent } from './bootstrap-components.component';

describe('BootstrapComponentsComponent', () => {
  let component: BootstrapComponentsComponent;
  let fixture: ComponentFixture<BootstrapComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootstrapComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootstrapComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
