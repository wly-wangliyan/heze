import { TestBed, inject } from '@angular/core/testing';

import { ParkingsDataService } from './parkings-data.service';

describe('ParkingsDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParkingsDataService]
    });
  });

  it('should be created', inject([ParkingsDataService], (service: ParkingsDataService) => {
    expect(service).toBeTruthy();
  }));
});
