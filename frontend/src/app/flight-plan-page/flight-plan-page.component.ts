import {ChangeDetectorRef, Component} from '@angular/core';
import {FlightPlan} from "../../shared/models/FlightPlan";
import {SelectAircraftComponent} from "../aircraft-page/select-aircraft/select-aircraft.component";
import {FlightPlanFormComponent} from "./flight-plan-form/flight-plan-form.component";
import {MatGridListModule} from '@angular/material/grid-list';
import {DisplayMeteoComponent} from "./display-meteo/display-meteo.component";
import {MatListModule} from '@angular/material/list';
import {FlightPlanService} from "../api/flight-plan.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MediaMatcher} from "@angular/cdk/layout";
import {Airport} from "../../shared/models/Airport";


@Component({
  selector: 'app-flight-plan-page',
  standalone: true,
  imports: [
    SelectAircraftComponent,
    FlightPlanFormComponent,
    DisplayMeteoComponent,
    MatGridListModule,
    MatListModule
  ],
  templateUrl: './flight-plan-page.component.html',
  styleUrl: './flight-plan-page.component.css'
})
export class FlightPlanPageComponent {

  airportCodeStart: string = '';
  airportCodeEnd: string = '';

  mobileQuery: MediaQueryList;

  constructor(
    private readonly flightPlanService: FlightPlanService,
    private readonly snackBar: MatSnackBar,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', () => changeDetectorRef.detectChanges());
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
      const startingAirport: string | Airport = change['startingAirport'];
      this.airportCodeStart = typeof startingAirport == 'string' ? startingAirport : (startingAirport.icaoCode ?? 'ZZZZ');
    } else if (change['destinationAirport']) {
      const destinationAirport: string | Airport = change['destinationAirport'];
      this.airportCodeEnd = typeof destinationAirport == 'string' ? destinationAirport : (destinationAirport.icaoCode ?? 'ZZZZ');
    }
  }
}
