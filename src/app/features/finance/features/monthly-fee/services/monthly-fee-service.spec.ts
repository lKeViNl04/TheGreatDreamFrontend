import { TestBed } from '@angular/core/testing';

import { MonthlyFeeService } from './monthly-fee-service';

describe('MonthlyFeeService', () => {
  let service: MonthlyFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
