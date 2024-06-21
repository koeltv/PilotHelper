import {Component} from '@angular/core';
import {FlightPlan} from "../../shared/models/FlightPlan";
import {ShowAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {FlyingPlanFormComponent} from "../flying-plan-form/flying-plan-form.component";
import {MatGridListModule} from '@angular/material/grid-list';
import {DisplayMeteoComponent} from "./display-meteo/display-meteo.component";
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-flying-plan-page',
  standalone: true,
  imports: [
    ShowAircraftForm,
    FlyingPlanFormComponent,
    DisplayMeteoComponent,
    MatGridListModule,
    MatListModule
  ],
  templateUrl: './flying-plan-page.component.html',
  styleUrl: './flying-plan-page.component.css'
})
export class FlyingPlanPageComponent {

  airportCodeStart:string = "";
  airportCodeEnd:string = "";

  onFormSubmit(newFlyingPlan: FlightPlan) {
    console.log('Flying Plan:', newFlyingPlan);
    // Envoie vers le backend
  }

  updateMeteo(change: { [key: string]: any }){
    if (change['startingAirport']) {
      this.airportCodeStart = change['startingAirport'];
    } else if (change['destinationAirport']) {
      this.airportCodeEnd = change['destinationAirport'];
    }
  }
}
