import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCardComponent } from './header-card.component';

describe('HeaderCardComponent', () => {
  let component: HeaderCardComponent;
  let fixture: ComponentFixture<HeaderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
