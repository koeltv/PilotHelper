import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FlightPlanFormComponent} from './flight-plan-form.component';

describe('FlightPlanFormComponent', () => {
  let component: FlightPlanFormComponent;
  let fixture: ComponentFixture<FlightPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightPlanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
