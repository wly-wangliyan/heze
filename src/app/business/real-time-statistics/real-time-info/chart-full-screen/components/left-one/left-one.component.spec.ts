import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftOneComponent } from './left-one.component';

describe('LeftOneComponent', () => {
  let component: LeftOneComponent;
  let fixture: ComponentFixture<LeftOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
