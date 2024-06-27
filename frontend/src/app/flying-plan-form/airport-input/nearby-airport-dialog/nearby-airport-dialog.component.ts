import {Component} from '@angular/core';
import {MatActionList, MatListItem} from "@angular/material/list";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {PlanningToolsService} from "../../../api/planning-tools.service";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {MatIcon} from "@angular/material/icon";
import {Airport} from "../../../../shared/models/Airport";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-nearby-airport-dialog',
  standalone: true,
  imports: [
    MatActionList,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatListItem,
    MatSlider,
    MatSliderThumb,
    MatIcon,
    FormsModule
  ],
  templateUrl: './nearby-airport-dialog.component.html',
  styleUrl: './nearby-airport-dialog.component.css'
})
export class NearbyAirportDialogComponent {
  airports: Airport[] = [];

  constructor(
    private planningToolsService: PlanningToolsService,
  ) {
    this.updateList();
  }

  updateList(radius: number | string = 0.2) {
    if (typeof radius == 'string') radius = parseFloat(radius);
    this.planningToolsService.getNearbyAirports(radius).subscribe(airports => {
      this.airports = airports;
    })
  }
}
