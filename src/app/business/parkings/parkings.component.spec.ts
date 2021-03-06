import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParkingsComponent } from './parkings.component';

describe('ParkingsComponent', () => {
  let component: ParkingsComponent;
  let fixture: ComponentFixture<ParkingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
