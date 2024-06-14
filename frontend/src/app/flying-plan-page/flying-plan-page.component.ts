import {Component} from '@angular/core';
import {FlightPlanService} from "../api/flight-plan.service";
import {FlightPlan} from "../../shared/models/FlightPlan";
import {environment} from "../../environments/environment";
import {showAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {FlyingPlanFormComponent} from "../flying-plan-form/flying-plan-form.component";
import {AirCraft} from "../../shared/models/AirCraft";

@Component({
  selector: 'app-flying-plan-page',
  standalone: true,
  imports: [
    showAircraftForm,
    FlyingPlanFormComponent
  ],
  templateUrl: './flying-plan-page.component.html',
  styleUrl: './flying-plan-page.component.css'
})
export class FlyingPlanPageComponent {
  protected pageUrl = `${environment.frontendUrl}/flyingplan`;
  public flightPlan: FlightPlan | undefined

  myAirCraft: AirCraft[] = [
    {
      aircraftId: "avion1",
      aircraftType: "A",
      turbulenceType: "1",
      equipment: "tout",
      transponder: "jsp",
      colorAndMarkings: "rouge"
    },
    {
      aircraftId: "avion2",
      aircraftType: "D",
      turbulenceType: "3",
      equipment: "tout",
      transponder: "jsp encore",
      colorAndMarkings: "bleu"
    }
  ];

  selectedAircraft: AirCraft = {
    aircraftId: '',
    aircraftType: '',
    turbulenceType: '',
    equipment: '',
    transponder: '',
    colorAndMarkings: ''
  };

  onAircraftSelected(selectedAircraft: AirCraft[]) {
    this.selectedAircraft = selectedAircraft[0];
  }

  onFormSubmit(newFlyingPlan: FlightPlan) {
    console.log('Flying Plan:', newFlyingPlan);
    // Envoie vers le backend
  }

  constructor(private flightPlanService: FlightPlanService) {
    flightPlanService.readFlightPlan(2)
      .subscribe(flightPlan => {
        console.log(flightPlan);
        this.flightPlan = flightPlan;
      });
  }

  protected readonly JSON = JSON;
  protected readonly encodeURI = encodeURI;
}
