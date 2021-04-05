import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParkingsListComponent } from './parkings-list.component';

describe('ParkingsListComponent', () => {
  let component: ParkingsListComponent;
  let fixture: ComponentFixture<ParkingsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
