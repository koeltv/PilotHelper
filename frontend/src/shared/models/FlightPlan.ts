import {Aircraft} from './Aircraft';
import {AircraftEquipment} from "./AircraftEquipment";

export class FlightPlan {
  constructor(
    public flightRules: string,
    public flightType: string,
    public aircraftData: Aircraft,
    public aircraftCount: number,
    public startingAirport: string,
    public startingTime: string,
    public cruisingSpeed: string,
    public cruisingAltitude: string,
    public path: string,
    public destinationAirport: string,
    public estimatedTime: string,
    public alternativeAirport: string[],
    public otherInformations: string[],
    public autonomy: string,
    public occupantCount: number,
    public equipment: AircraftEquipment,
    public remarks: string,
    public pilot: string
  ) {
  }
}
