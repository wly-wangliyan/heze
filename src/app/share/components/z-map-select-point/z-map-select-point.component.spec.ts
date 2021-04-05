import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZMapSelectPointComponent } from './z-map-select-point.component';

describe('ZMapSelectPointComponent', () => {
  let component: ZMapSelectPointComponent;
  let fixture: ComponentFixture<ZMapSelectPointComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZMapSelectPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZMapSelectPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
