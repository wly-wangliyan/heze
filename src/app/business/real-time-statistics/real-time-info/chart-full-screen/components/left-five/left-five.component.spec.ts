import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftFiveComponent } from './left-five.component';

describe('LeftFiveComponent', () => {
  let component: LeftFiveComponent;
  let fixture: ComponentFixture<LeftFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
