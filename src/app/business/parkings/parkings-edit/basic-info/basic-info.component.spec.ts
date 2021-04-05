import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditBasicInfoComponent } from './basic-info.component';

describe('EditBasicInfoComponent', () => {
  let component: EditBasicInfoComponent;
  let fixture: ComponentFixture<EditBasicInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
