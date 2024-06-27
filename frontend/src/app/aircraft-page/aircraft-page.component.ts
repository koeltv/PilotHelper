import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import {ShowAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {AirCraft} from "../../shared/models/AirCraft";
import {DataService} from "../api/data.service";

@Component({
  selector: 'aircraft-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgForOf,
    PersonalAircraftFormComponent,
    ShowAircraftForm,
    ReactiveFormsModule
  ],
  templateUrl: './aircraft-page.component.html',
  styleUrl: './aircraft-page.component.css'
})
export class AircraftPageComponent {
  airCraftList: AirCraft[] = [];
  visibleAircraft: AirCraft[] = [];

  constructor(private dataService: DataService) {
    this.fetchAircrafts();
  }

  private fetchAircrafts() {
    this.dataService.readAllAircraft().subscribe(aircrafts => {
      this.airCraftList = aircrafts;
    });
  }

  addAircraft(aircraft: AirCraft) {
    this.dataService.createAircraft(aircraft).subscribe(() => this.fetchAircrafts());
  }

  updateVisibleAircraft(updatedList: AirCraft[]) {
    this.visibleAircraft = updatedList;
  }
}
