import {NgModule} from '@angular/core';
import { Routes} from '@angular/router';
import { HomeComponent} from './home/home.component';
import {AircraftPageComponent} from "./aircraft-page/aircraft-page.component";
import {FlyingPlanPageComponent} from "./flying-plan-page/flying-plan-page.component";

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
  }
];

export default routeConfig;
