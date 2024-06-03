import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { airCraft} from "../shared/models/airCraft";
import { PersonalAircraftFormComponent} from "./create-aircraft-form/create-aicraft-form.component";
import {NgForOf, CommonModule} from "@angular/common";
import {showAircraftForm} from "./show-aircaft-form/show-aircraft-form.component";
import { RouterModule} from "@angular/router";
import routeConfig from "./app.routes";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, PersonalAircraftFormComponent, CommonModule, showAircraftForm, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
