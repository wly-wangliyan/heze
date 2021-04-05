import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftThreeComponent } from './left-three.component';

describe('LeftThreeComponent', () => {
  let component: LeftThreeComponent;
  let fixture: ComponentFixture<LeftThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
