import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlightPlanPageComponent} from './flight-plan-page.component';

describe('FlightPlanPageComponent', () => {
  let component: FlightPlanPageComponent;
  let fixture: ComponentFixture<FlightPlanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPlanPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightPlanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
