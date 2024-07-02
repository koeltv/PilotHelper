import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlightPlanListPageComponent} from './flight-plan-list-page.component';

describe('FlightPlanListPageComponent', () => {
  let component: FlightPlanListPageComponent;
  let fixture: ComponentFixture<FlightPlanListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPlanListPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlightPlanListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
