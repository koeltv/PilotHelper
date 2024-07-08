import {Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {AircraftPageComponent} from './aircraft-page/aircraft-page.component';
import {FlightPlanPageComponent} from './flight-plan-page/flight-plan-page.component';
import {FlightPlanListPageComponent} from './flight-plan-list-page/flight-plan-list-page.component';

const routeConfig : Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Accueil'
  },
  {
    path: 'aircraft',
    component: AircraftPageComponent,
    title: 'Mes aéronefs'
  },
  {
    path: 'flyingplan',
    component: FlightPlanPageComponent,
    title: 'Planifier un vol'
  },
  {
    path: 'my-flyingplans',
    component: FlightPlanListPageComponent,
    title: 'Mes plans de vol'
  }
];

export default routeConfig;
