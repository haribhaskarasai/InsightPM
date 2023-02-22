import { TestBed } from '@angular/core/testing';

import { TsmAlertServiceService } from './tsm-alert-service.service';

describe('TsmAlertServiceService', () => {
  let service: TsmAlertServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TsmAlertServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
