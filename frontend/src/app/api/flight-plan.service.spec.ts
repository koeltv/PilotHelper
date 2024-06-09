import {TestBed} from '@angular/core/testing';

import {FlightPlanService} from './flight-plan.service';

describe('FlightPlanService', () => {
  let service: FlightPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
