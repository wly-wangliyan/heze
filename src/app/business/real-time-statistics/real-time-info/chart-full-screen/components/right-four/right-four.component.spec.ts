import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightFourComponent } from './right-four.component';

describe('RightFourComponent', () => {
  let component: RightFourComponent;
  let fixture: ComponentFixture<RightFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
