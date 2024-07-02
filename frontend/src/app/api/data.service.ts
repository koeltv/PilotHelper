import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Aircraft} from "../../shared/models/Aircraft";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = `/data/aircraft`

  constructor(private client: HttpClient) {
  }

  createAircraft(aircraft: Aircraft): Observable<number> {
    return this.client.post<number>(this.baseUrl, aircraft);
  }

  readAircraft(id: number): Observable<Aircraft | undefined> {
    return this.client.get<Aircraft | undefined>(`${this.baseUrl}/${id}`);
  }

  readAllAircraft(): Observable<Aircraft[]> {
    return this.client.get<Aircraft[]>(`${this.baseUrl}/user`);
  }
}
