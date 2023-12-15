import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpAndDownloadsComponent } from './up-and-downloads.component';

describe('UpAndDownloadsComponent', () => {
  let component: UpAndDownloadsComponent;
  let fixture: ComponentFixture<UpAndDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpAndDownloadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpAndDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
