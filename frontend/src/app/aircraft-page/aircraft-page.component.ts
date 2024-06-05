import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, CommonModule} from "@angular/common";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import {showAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
import {airCraft} from "../../shared/models/airCraft";

@Component({
  selector: 'aircraft-page',
  standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NgForOf,
        PersonalAircraftFormComponent,
        showAircraftForm,
        ReactiveFormsModule
    ],
  templateUrl: './aircraft-page.component.html',
  styleUrl: './aircraft-page.component.css'
})
export class AircraftPageComponent {

  airCraftList: airCraft[] = [];
  visibleAircraft: airCraft[] = [];

  addAircraft(aircraft: airCraft) {
    this.airCraftList.push(aircraft);
  }

  updateVisibleAircraft(updatedList: airCraft[]) {
    this.visibleAircraft = updatedList;
  }

}
