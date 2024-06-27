import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FlightPlan} from "../../shared/models/FlightPlan";

export class FlightPlanWithId {
  constructor(
    public id: number,
    public flightPlan: FlightPlan,
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class FlightPlanService {
  private baseUrl = `/flight-plan`;

  constructor(private client: HttpClient) {
  }

  createFlightPlan(flightPlan: FlightPlan): Observable<number> {
    return (<Observable<number>>this.client.post(this.baseUrl, flightPlan));
  }

  readAllFlightPlans(): Observable<FlightPlanWithId[]> {
    return this.client.get<FlightPlanWithId[]>(`${this.baseUrl}/user`);
  }

  readFlightPlan(id: number): Observable<FlightPlan | undefined> {
    return this.client.get<FlightPlan | undefined>(`${this.baseUrl}/${id}`);
  }

  updateFlightPlan(id: number, flightPlan: FlightPlan): Observable<any> {
    return this.client.put(`${this.baseUrl}/${id}`, flightPlan);
  }

  deleteFlightPlan(id: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }
}
