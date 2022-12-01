import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSimpleIndividualComponent } from './create-simple-individual.component';

describe('CreateSimpleIndividualComponent', () => {
  let component: CreateSimpleIndividualComponent;
  let fixture: ComponentFixture<CreateSimpleIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSimpleIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSimpleIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
