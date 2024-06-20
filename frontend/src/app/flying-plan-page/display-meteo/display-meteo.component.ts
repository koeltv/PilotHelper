import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PlanningToolsService} from "../../api/planning-tools.service";
import {Cloud} from "../../../shared/models/Weather";
import {NgIf} from "@angular/common";
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'display-meteo',
  standalone: true,
  imports: [
    NgIf,
    MatListModule,
    MatCardModule
  ],
  templateUrl: './display-meteo.component.html',
  styleUrl: './display-meteo.component.css'
})

export class DisplayMeteoComponent implements OnChanges {

  @Input() airportCode!: string;

    nameDisplay:string ="";
    conditionDisplay:string = "";
    temperatureDisplay:string = "";
    dewpointDisplay:string = "";
    pressureDisplay:string = "";
    windsDisplay:string = "";
    visibilityDisplay:string = "";
    cloudsDisplay:string = "";


   constructor(private planningToolService: PlanningToolsService) {
   }

  ngOnChanges(changes: SimpleChanges) {
     if(this.airportCode.length==4){
       this.displayWeatherFunction(this.airportCode);
     }else{
       this.nameDisplay = "Entrez un aéroport pour y voir la météo !";
     }
  }

   displayWeatherFunction(airportCode:string){
      this.planningToolService.getWeatherInfoFor(airportCode).subscribe(info =>{
        this.nameDisplay = `<b>METAR pour :</b> ${info.name} `;
        this.conditionDisplay = `<b>Conditions à:</b> ${UnixToTimespan(info.obsTime)} `;
        this.temperatureDisplay = `<b>Temperature:</b>	${info.temp}°C (${celsiusToFahrenheit(info.temp)}°F) `;
        this.dewpointDisplay = `<b>Dewpoint:</b>	${info.dewp}°C (${celsiusToFahrenheit(info.dewp)} °F) `;
        this.pressureDisplay = `<b>Pressure (altimeter):</b>	${mbToInchHg(info.altim)}  inches Hg (${info.altim} mb)`;
        this.windsDisplay = `<b>Vents:</b> ${degToCompass(info.wdir)} (${info.wdir} degrés) à ${ktToMph(info.wspd)} MPH (${info.wspd} knots; ${ktToMs(info?.wspd)} m/s)`;
        this.visibilityDisplay = `<b>Visibilité:</b>	${visibilityDecode(info.visib)}`;
        this.cloudsDisplay = `<b>Nuages:</b> ${this.cloudInfoDisplay(info.clouds)}`;
      })
   }

  protected readonly degToCompass = degToCompass;
  protected readonly ktToMph = ktToMph;
  protected readonly ktToMs = ktToMs;
  protected readonly celsiusToFahrenheit = celsiusToFahrenheit;

  cloudInfoDisplay(clouds: Cloud[] | undefined) {
    let cloudsSentence = "";
    if(clouds){
      clouds.forEach(cloud =>{
        cloudsSentence += ` ${coverAbbreviationToCover(cloud.cover)} `
        if(cloud.base !=null) {
          cloudsSentence += `clouds at ${cloud.base} feet,`
        }
      })
    }
    return cloudsSentence;
  }

  protected readonly mbToInchHg = mbToInchHg;
}


function visibilityDecode(visibility:any):string{
  if (visibility== "6+" ) {
    return "6+ sm (10+ km)"
  } else {
    let visbilityInKm = (Number(visibility) * 1.60934).toFixed(2);
    return `${visibility} sm ( ${visbilityInKm} km)`;
  }
}

function degToCompass(num: number) {

    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["Nord", "Nord-Nord-Est ", "Nord-Est ", "Est-Nord-Est ", "Est", "Est-Sud-Est ", "Sud-Est", "Sud-Sud-Est ", "Sud", "Susuroît", "Suroît", "Ouest-Suroît ", "Ouest", "Ouest-Noroît ", "Noroît", "Nord-Noroît "];
    return arr[(val % 16)];

}
function ktToMph(num: number) {

    return (1.15*num).toFixed(2);

}
function ktToMs(num: number) {

    return (0.514444*num).toFixed(2);

}

function celsiusToFahrenheit(num: number) {

    return (2*num+30).toFixed(2);

}


function coverAbbreviationToCover(coverShorthand:string){
  switch (coverShorthand){
    case "FEW": {
      return "few"
    }
    case "SCT": {
      return "scattered"
    }
    case "BKN": {
      return "broken"
    }
    case "OVC": {
      return "overcast"
    }
    case "CAVOK": {
      return "ceiling and visibility are OK"
    }
    default:{
      return "There has been a error"
    }
  }
}

function mbToInchHg (mb:number){

    return (mb/33.8639).toFixed(2);

}

function UnixToTimespan(unix:number){
  return new Date(unix);
}
