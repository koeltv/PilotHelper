import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AirCraft} from "../../shared/models/AirCraft";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl =  `${environment.backendUrl}/data/aircraft`
  private options = {withCredentials: true};

  constructor(private client: HttpClient) {
  }

  createAircraft(aircraft: AirCraft): Observable<number>{
    return this.client.post<number>(this.baseUrl, aircraft, this.options);
  }

  readAircraft(id: number): Observable<AirCraft | undefined> {
    return this.client.get<AirCraft| undefined>(`${this.baseUrl}/${id}`, this.options);
  }

  readAllAircraft(): Observable<AirCraft[] > {
    return this.client.get<AirCraft[]>(`${this.baseUrl}/user`, this.options);
  }
}
