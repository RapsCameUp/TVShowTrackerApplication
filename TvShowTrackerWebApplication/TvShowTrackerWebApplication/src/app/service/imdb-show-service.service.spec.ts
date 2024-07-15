import { TestBed } from '@angular/core/testing';

import { ImdbShowServiceService } from './imdb-show-service.service';

describe('ImdbShowServiceService', () => {
  let service: ImdbShowServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImdbShowServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
