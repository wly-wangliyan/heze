import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MonitorInfoComponent } from './monitor-info.component';

describe('MonitorInfoComponent', () => {
  let component: MonitorInfoComponent;
  let fixture: ComponentFixture<MonitorInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
