import { TestBed } from '@angular/core/testing';

import { MonitorInfoService } from './monitor-info.service';

describe('MonitorInfoService', () => {
  let service: MonitorInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
