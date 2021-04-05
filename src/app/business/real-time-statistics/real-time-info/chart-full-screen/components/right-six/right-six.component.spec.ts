import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSixComponent } from './right-six.component';

describe('RightSixComponent', () => {
  let component: RightSixComponent;
  let fixture: ComponentFixture<RightSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
