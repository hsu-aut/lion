import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphManagementComponent } from './graph-management.component';

describe('GraphManagementComponent', () => {
  let component: GraphManagementComponent;
  let fixture: ComponentFixture<GraphManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
