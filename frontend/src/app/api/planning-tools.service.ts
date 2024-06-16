import {Injectable} from '@angular/core';
import {from, Observable, switchMap} from "rxjs";
import {Weather} from "../../shared/models/Weather";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Route} from "../../shared/models/Route";
import {AirCraftType} from "../../shared/models/AirCraftType";
import {Airport} from "../../shared/models/Airport";

@Injectable({
  providedIn: 'root'
})
export class PlanningToolsService {
  private readonly baseUrl = `${environment.backendUrl}/planning-tools`
  private readonly publicIpProvider = "https://icanhazip.com/";
  private readonly options = {withCredentials: true};

  constructor(private client: HttpClient) {
  }

  getWeatherInfoFor(airportId: string): Observable<Weather> {
    return this.client.get<Weather>(`${this.baseUrl}/weather/${airportId}`, this.options);
  }

  getRoutesBetween(startingAirport: string, destinationAirport: string): Observable<Route[]> {
    return this.client.get<Route[]>(`${this.baseUrl}/route?from=${startingAirport}&to=${destinationAirport}`, this.options);
  }

  getAllAircraftTypes(): Observable<AirCraftType[]> {
    return this.client.get<AirCraftType[]>(`${this.baseUrl}/aircraft-type`, this.options);
  }

  getAircraftTypesByName(name: string): Observable<AirCraftType[]> {
    return this.client.get<AirCraftType[]>(`${this.baseUrl}/aircraft-type/name/${name}`, this.options);
  }

  getAircraftTypesByType(type: string): Observable<AirCraftType[]> {
    return this.client.get<AirCraftType[]>(`${this.baseUrl}/aircraft-type/type/${type}`, this.options);
  }

  getAllAirports(): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport`, this.options);
  }

  getAirportsByName(name: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/name/${name}`, this.options);
  }

  getAirportsByICAO(icao: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/icao/${icao}`, this.options);
  }

  getAirportsByIATA(iata: string): Observable<Airport[]> {
    return this.client.get<Airport[]>(`${this.baseUrl}/airport/iata/${iata}`, this.options);
  }

  getNearbyAirports(radius: number = 2): Observable<Airport[]> {
    return from(fetch(this.publicIpProvider).then(response => response.text())).pipe(
      switchMap(publicIp => {
        return this.client.get<Airport[]>(`${this.baseUrl}/airport/nearby/ip/${publicIp.trim()}?radius=${radius}`, this.options);
      })
    )
  }
}
