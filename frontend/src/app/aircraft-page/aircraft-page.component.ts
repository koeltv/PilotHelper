import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {AircraftFormComponent} from "./aircraft-form/aircraft-form.component";
import {Aircraft} from "../../shared/models/Aircraft";
import {DataService} from "../api/data.service";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {SelectAircraftComponent} from "./select-aircraft/select-aircraft.component";

@Component({
  selector: 'app-aircraft-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    AircraftFormComponent,
    SelectAircraftComponent,
    ReactiveFormsModule,
    MatFabButton,
    MatIcon,
    SelectAircraftComponent
  ],
  templateUrl: './aircraft-page.component.html',
  styleUrl: './aircraft-page.component.css'
})
export class AircraftPageComponent {
  airCraftList: Aircraft[] = [];
  visibleAircraft: Aircraft[] = [];

  constructor(private dataService: DataService) {
    this.fetchAircrafts();
  }

  private fetchAircrafts() {
    this.dataService.readAllAircraft().subscribe(aircrafts => {
      this.airCraftList = aircrafts;
    });
  }

  addAircraft(aircraft: Aircraft) {
    this.dataService.createAircraft(aircraft).subscribe(() => this.fetchAircrafts());
  }

  updateVisibleAircraft(updatedList: Aircraft[]) {
    this.visibleAircraft = updatedList;
  }
}
