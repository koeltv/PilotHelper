import {Component} from '@angular/core';
import {FlightPlan} from "../../shared/models/FlightPlan";
import {ShowAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {FlyingPlanFormComponent} from "../flying-plan-form/flying-plan-form.component";
import {AirCraft} from "../../shared/models/AirCraft";
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

  airportCodeStart:string = "";
  airportCodeEnd:string = "";

  onAircraftSelected(selectedAircraft: AirCraft[]) {
    this.selectedAircraft = selectedAircraft[0];
  }

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
