import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProCityDistSelectComponent } from './pro-city-dist-select.component';

describe('ProCityDistSelectComponent', () => {
  let component: ProCityDistSelectComponent;
  let fixture: ComponentFixture<ProCityDistSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProCityDistSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProCityDistSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
