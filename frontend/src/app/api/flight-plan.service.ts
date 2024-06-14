import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {FlightPlan} from "../../shared/models/FlightPlan";

@Injectable({
  providedIn: 'root'
})
export class FlightPlanService {
  private baseUrl = `${environment.backendUrl}/flight-plan/`
  private options = {withCredentials: true};

  constructor(private client: HttpClient) {
  }

  createFlightPlan(flightPlan: FlightPlan): Observable<number> {
    return (<Observable<number>>this.client.post(this.baseUrl, flightPlan));
  }

  readFlightPlan(id: number): Observable<FlightPlan | undefined> {
    return this.client.get<FlightPlan | undefined>(`${this.baseUrl}/${id}`, this.options);
  }

  updateFlightPlan(id: number, flightPlan: FlightPlan): Observable<any> {
    return this.client.put(`${this.baseUrl}/${id}`, flightPlan, this.options);
  }

  deleteFlightPlan(id: number): Observable<any> {
    return this.client.delete(`${this.baseUrl}/${id}`, this.options);
  }

  getFlightPlanPdf(id: number): Observable<Blob> {
    return this.client.get(`${this.baseUrl}/${id}/pdf`, {
      withCredentials: this.options.withCredentials,
      responseType: 'blob'
    });
  }
}
