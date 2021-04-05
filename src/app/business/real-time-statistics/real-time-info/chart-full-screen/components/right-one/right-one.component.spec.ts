import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightOneComponent } from './right-one.component';

describe('RightOneComponent', () => {
  let component: RightOneComponent;
  let fixture: ComponentFixture<RightOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
