import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PlanningToolsService} from "../../api/planning-tools.service";
import {Cloud} from "../../../shared/models/Weather";
import {NgIf} from "@angular/common";
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'display-meteo',
  standalone: true,
  imports: [
    NgIf,
    MatListModule
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
     console.log("testtest",this.airportCode);
     if(this.airportCode.length==4){
       this.displayWeatherFunction(this.airportCode);
     }
  }

   displayWeatherFunction(airportCode:string){
      this.planningToolService.getWeatherInfoFor(airportCode).subscribe(info =>{
        this.nameDisplay = `METAR for: ${info.name} `;
        this.conditionDisplay = `Conditions at: ${info.obsTime} `;
        this.temperatureDisplay = `Temperature:	${info.temp}°C ( ${celsiusToFahrenheit(info.temp)}°F) `;
        this.dewpointDisplay = `Dewpoint:	${info.dewp}°C ( ${celsiusToFahrenheit(info.dewp)} °F) `;
        this.pressureDisplay = `Pressure (altimeter):	${mbToInchHg(info.altim)}} inches Hg (${info.altim} mb)`;
        this.windsDisplay = `Winds:	from the ${degToCompass(info.wdir)} (${info.wdir} degrees) at ${ktToMph(info.wspd)} MPH (${info.wspd} knots; ${ktToMs(info?.wspd)} m/s)`;
        this.visibilityDisplay = `Visibility:	${visibilityDecode(info.visib)}`;
        this.cloudsDisplay = `Clouds: ${this.cloudInfoDisplay(info.clouds)}`;

        console.log(info);
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

//TODO: find more case to complete this fucntion
function visibilityDecode(visibility:string){
  switch (visibility){
    case"6+":{
      return "6 or more sm (10+ km)"
    }
  }
  return "This condition was not handel";
}

function degToCompass(num: number) {

    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
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
