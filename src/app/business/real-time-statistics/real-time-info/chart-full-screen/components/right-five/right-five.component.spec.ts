import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightFiveComponent } from './right-five.component';

describe('RightFiveComponent', () => {
  let component: RightFiveComponent;
  let fixture: ComponentFixture<RightFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
