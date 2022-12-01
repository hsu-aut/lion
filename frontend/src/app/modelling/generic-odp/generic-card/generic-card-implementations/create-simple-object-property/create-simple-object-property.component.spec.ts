import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSimpleObjectPropertyComponent } from './create-simple-object-property.component';

describe('CreateSimpleObjectPropertyComponent', () => {
  let component: CreateSimpleObjectPropertyComponent;
  let fixture: ComponentFixture<CreateSimpleObjectPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSimpleObjectPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSimpleObjectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
