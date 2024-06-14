import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgForOf} from "@angular/common";
import {PersonalAircraftFormComponent} from "../create-aircraft-form/create-aicraft-form.component";
import {showAircraftForm} from "../show-aircaft-form/show-aircraft-form.component";
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
        showAircraftForm,
        ReactiveFormsModule
    ],
  templateUrl: './aircraft-page.component.html',
  styleUrl: './aircraft-page.component.css'
})
export class AircraftPageComponent {

  airCraftList: AirCraft[] = [];
  visibleAircraft: AirCraft[] = [];

  constructor(private dataService: DataService) {
  }

  addAircraft(aircraft: AirCraft) {
    console.log('test', aircraft);
    this.dataService.createAircraft(aircraft).subscribe(result=> console.log(result));
    //this.airCraftList.push(aircraft);
  }

  updateVisibleAircraft(updatedList: AirCraft[]) {
    this.dataService.readAllAircraft().subscribe(allAircrafts =>{
      this.airCraftList = allAircrafts;
      this.visibleAircraft = updatedList;
    });
  }

}
