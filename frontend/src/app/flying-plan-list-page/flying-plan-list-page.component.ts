import {Component} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlightPlanService} from "../api/flight-plan.service";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {FlightPlan} from "../../shared/models/FlightPlan";

class Source {
  constructor(
    public url: string,
    public withCredentials: boolean = true
  ) {
  }
}

export class FlightPlanPdf {
  public source: Source;

  constructor(
    public id: number,
    public flightPlan: FlightPlan,
  ) {
    this.source = new Source(`http://localhost/flight-plan/${id}/pdf`)
  }
}

@Component({
  selector: 'app-flying-plan-list-page',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    PdfViewerModule
  ],
  templateUrl: './flying-plan-list-page.component.html',
  styleUrl: './flying-plan-list-page.component.css'
})
export class FlyingPlanListPageComponent {
  flightPlans: FlightPlanPdf[] = [];
  source = {
    url: 'http://localhost/flight-plan/1/pdf',
    withCredentials: true
  };

  constructor(flightPlanService: FlightPlanService) {
    flightPlanService.readAllFlightPlans().subscribe(flightPlansWithId => {
      this.flightPlans = [];
      for (let flightPlanWithId of flightPlansWithId) {
        this.flightPlans.push(new FlightPlanPdf(flightPlanWithId.id, flightPlanWithId.flightPlan));
      }
    })
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }
}
