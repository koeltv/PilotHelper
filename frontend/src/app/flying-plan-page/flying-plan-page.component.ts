import {Component} from '@angular/core';
import {FlightPlanService} from "../api/flight-plan.service";
import {FlightPlan} from "../../shared/models/FlightPlan";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-flying-plan-page',
  standalone: true,
  imports: [],
  templateUrl: './flying-plan-page.component.html',
  styleUrl: './flying-plan-page.component.css'
})
export class FlyingPlanPageComponent {
  protected pageUrl = `${environment.frontendUrl}/flyingplan`;
  public flightPlan: FlightPlan | undefined

  constructor(flightPlanService: FlightPlanService) {
    flightPlanService.readFlightPlan(2)
      .subscribe(flightPlan => {
        console.log(flightPlan);
        this.flightPlan = flightPlan;
      });
  }

  protected readonly JSON = JSON;
  protected readonly encodeURI = encodeURI;
}
