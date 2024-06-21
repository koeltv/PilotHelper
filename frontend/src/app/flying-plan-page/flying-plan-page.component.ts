import {Component} from '@angular/core';
import {FlightPlan} from "../../shared/models/FlightPlan";
import {ShowAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {FlyingPlanFormComponent} from "../flying-plan-form/flying-plan-form.component";
import {AirCraft} from "../../shared/models/AirCraft";
import {MatGridListModule} from '@angular/material/grid-list';
import {DisplayMeteoComponent} from "./display-meteo/display-meteo.component";
import {MatListModule} from '@angular/material/list';
import {DataService} from "../api/data.service";
import {FlightPlanService} from "../api/flight-plan.service";
import {MatSnackBar} from "@angular/material/snack-bar";


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

  aircrafts: AirCraft[] = [];

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

  constructor(
    private readonly dataService: DataService,
    private readonly flightPlanService: FlightPlanService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.dataService.readAllAircraft().subscribe(aircrafts => {
      this.aircrafts = aircrafts;
    })
  }

  onAircraftSelected(selectedAircraft: AirCraft[]) {
    this.selectedAircraft = selectedAircraft[0];
  }

  onFormSubmit(newFlyingPlan: FlightPlan) {
    this.flightPlanService.createFlightPlan(newFlyingPlan).subscribe(id => {
      if (id) {
        this.snackBar.open('Plan de vol créé avec succès !', 'OK');
      } else {
        this.snackBar.open('Une erreur à eu lieu, veuillez vérifier le formulaire', 'OK');
      }
    });
  }

  updateMeteo(change: { [key: string]: any }){
    if (change['startingAirport']) {
      this.airportCodeStart = change['startingAirport'];
    } else if (change['destinationAirport']) {
      this.airportCodeEnd = change['destinationAirport'];
    }
  }
}
