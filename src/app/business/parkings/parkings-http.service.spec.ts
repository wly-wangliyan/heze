import { TestBed, inject } from '@angular/core/testing';

import { ParkingsHttpService } from './parkings-http.service';

describe('ParkingsHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingsHttpService]
    });
  });

  it('should be created', inject([ParkingsHttpService], (service: ParkingsHttpService) => {
    expect(service).toBeTruthy();
  }));
});
