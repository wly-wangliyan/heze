import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightTwoComponent } from './right-two.component';

describe('RightTwoComponent', () => {
  let component: RightTwoComponent;
  let fixture: ComponentFixture<RightTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
