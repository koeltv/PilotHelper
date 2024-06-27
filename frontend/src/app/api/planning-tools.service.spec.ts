import {TestBed} from '@angular/core/testing';

import {PlanningToolsService} from './planning-tools.service';

describe('PlanningToolsService', () => {
  let service: PlanningToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
