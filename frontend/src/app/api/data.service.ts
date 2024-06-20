import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AirCraft} from "../../shared/models/AirCraft";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = `/data/aircraft`

  constructor(private client: HttpClient) {
  }

  createAircraft(aircraft: AirCraft): Observable<number>{
    return this.client.post<number>(this.baseUrl, aircraft);
  }

  readAircraft(id: number): Observable<AirCraft | undefined> {
    return this.client.get<AirCraft | undefined>(`${this.baseUrl}/${id}`);
  }

  readAllAircraft(): Observable<AirCraft[] > {
    return this.client.get<AirCraft[]>(`${this.baseUrl}/user`);
  }
}
