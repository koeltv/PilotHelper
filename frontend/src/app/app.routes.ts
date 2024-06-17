import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AircraftPageComponent} from "./aircraft-page/aircraft-page.component";
import {FlyingPlanPageComponent} from "./flying-plan-page/flying-plan-page.component";
import {FlyingPlanListPageComponent} from "./flying-plan-list-page/flying-plan-list-page.component";

const routeConfig : Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'aircraft',
    component: AircraftPageComponent,
    title: 'Aircrafts page'
  },
  {
    path: 'flyingplan',
    component: FlyingPlanPageComponent,
    title: 'Flying Plan'
  },
  {
    path: 'my-flyingplans',
    component: FlyingPlanListPageComponent,
    title: 'My Flying Plans'
  }
];

export default routeConfig;
