import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {FlightPlan} from "../../shared/models/FlightPlan";

@Injectable({
  providedIn: 'root'
})
export class FlightPlanService {
  private baseUrl = `${environment.backendUrl}/flight-plan`

  constructor(private client: HttpClient) {
  }

  createFlightPlan(flightPlan: FlightPlan): Observable<number> {
    return (<Observable<number>>this.client.post(this.baseUrl, flightPlan));
  }

  readFlightPlan(id: number): Observable<FlightPlan> {
    return (<Observable<FlightPlan>>this.client.get(`${this.baseUrl}/${id}`));
  }

  updateFlightPlan(id: number, flightPlan: FlightPlan): Observable<any> {
    return this.client.put(`${this.baseUrl}/${id}`, flightPlan);
  }

  deleteFlightPlan(id: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`);
  }

  getFlightPlanPdf(id: number): Observable<Blob> {
    return this.client.get(`${this.baseUrl}/${id}/pdf`, {responseType: 'blob'});
  }
}
