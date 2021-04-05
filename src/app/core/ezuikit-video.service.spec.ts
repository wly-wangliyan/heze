import { TestBed } from '@angular/core/testing';

import { EzuikitVideoService } from './ezuikit-video.service';

describe('EzuikitVideoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EzuikitVideoService = TestBed.get(EzuikitVideoService);
    expect(service).toBeTruthy();
  });
});
