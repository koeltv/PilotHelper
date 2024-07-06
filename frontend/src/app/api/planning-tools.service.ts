import {Injectable} from '@angular/core';
import {catchError, from, Observable, of, switchMap} from "rxjs";
import {Weather} from "../../shared/models/Weather";
import {HttpClient} from "@angular/common/http";
import {Route} from "../../shared/models/Route";
import {AircraftType} from "../../shared/models/AircraftType";
import {Airport} from "../../shared/models/Airport";

@Injectable({
  providedIn: 'root'
})
export class PlanningToolsService {
  private readonly baseUrl = `/planning-tools`
  private readonly publicIpProvider = "https://icanhazip.com/";

  constructor(private client: HttpClient) {
  }

  getWeatherInfoFor(airportId: string): Observable<Weather | null> {
    return this.client.get<Weather | null>(`${this.baseUrl}/weather/${airportId}`).pipe(
      catchError(error => {
        if (error.status == '404') return of(null);
        else throw error;
      })
    );
  }

  getRoutesBetween(startingAirport: string, destinationAirport: string): Observable<Route[]> {
    return this.client.get<Route[]>(`${this.baseUrl}/route?from=${startingAirport}&to=${destinationAirport}`);
  }

  getAllAircraftTypes(): Observable<AircraftType[]> {
    return this.client.get<AircraftType[]>(`${this.baseUrl}/aircraft-type`);
  }

  getAircraftTypesByName(name: string): Observable<AircraftType[]> {
    return this.client.get<AircraftType[]>(`${this.baseUrl}/aircraft-type/name/${name}`);
  }

  getAircraftTypesByType(type: string): Observable<AircraftType[]> {
    return this.client.get<AircraftType[]>(`${this.baseUrl}/aircraft-type/type/${type}`);
  }

  getAllAirports(): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport`);
  }

  getAirportsByName(name: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/name/${name}`);
  }

  getAirportsByICAO(icao: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/icao/${icao}`);
  }

  getAirportsByIATA(iata: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/iata/${iata}`);
  }

  getNearbyAirports(radius: number = 2): Observable<Airport[]> {
    return from(fetch(this.publicIpProvider).then(response => response.text())).pipe(
      switchMap(publicIp => {
        return this.client.get<Airport[]>(`${this.baseUrl}/airport/nearby/ip/${publicIp.trim()}?radius=${radius}`);
      })
    )
  }
}
